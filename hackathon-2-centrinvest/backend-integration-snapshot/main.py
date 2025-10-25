from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from uuid import uuid4
import psycopg2
import psycopg2.extras
import hashlib
import jwt
import os
from datetime import datetime, timedelta
from typing import Optional, List
import json

# Database configuration
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "dbname": os.getenv("DB_NAME", "meeting_db"),
    "user": os.getenv("DB_USER", "api_user"),
    "password": os.getenv("DB_PASSWORD", ""),
    "sslmode": os.getenv("DB_SSLMODE", "prefer"),
}

# JWT configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI(title="Meeting Management API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Pydantic models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    firstName: str
    lastName: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str
    email: str
    firstName: str
    lastName: str
    role: str

class AuthResponse(BaseModel):
    token: str
    user: User

class ClientCreate(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    phone: str
    company: Optional[str] = None
    position: Optional[str] = None
    address: str
    priority: str = "standard"

class Client(BaseModel):
    id: str
    firstName: str
    lastName: str
    email: str
    phone: str
    company: Optional[str] = None
    position: Optional[str] = None
    address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    priority: str
    status: str
    createdAt: str
    updatedAt: str

class TaskCreate(BaseModel):
    title: str
    description: str
    clientId: str
    employeeId: str
    status: str = "pending"
    priority: str = "medium"
    startDate: str
    endDate: str

class Task(BaseModel):
    id: str
    title: str
    description: str
    clientId: str
    clientName: Optional[str] = None
    employeeId: str
    employeeName: Optional[str] = None
    status: str
    priority: str
    startDate: str
    endDate: str
    createdAt: str
    updatedAt: str

class MeetingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    clientId: str
    employeeId: str
    meetingTypeId: Optional[str] = None
    startDate: str
    endDate: str
    location: str
    address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    priority: str = "standard"
    isRecurring: bool = False
    recurringPattern: Optional[str] = None

class Meeting(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    clientId: str
    clientName: Optional[str] = None
    employeeId: str
    employeeName: Optional[str] = None
    meetingTypeId: Optional[str] = None
    meetingTypeName: Optional[str] = None
    startDate: str
    endDate: str
    location: str
    address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: str
    priority: str
    isRecurring: bool
    recurringPattern: Optional[str] = None
    durationMinutes: Optional[int] = None
    orderIndex: int = 0
    createdAt: str
    updatedAt: str

class MeetingTypeCreate(BaseModel):
    name: str
    defaultDuration: int = 60
    color: str = "#3B82F6"
    bgColor: str = "#EFF6FF"
    borderColor: str = "#3B82F6"
    isCustom: bool = True

class MeetingType(BaseModel):
    id: str
    name: str
    defaultDuration: int
    color: str
    bgColor: str
    borderColor: str
    isCustom: bool
    createdAt: str
    updatedAt: str

class RouteOptimizationRequest(BaseModel):
    meetingIds: List[str]
    startLocation: Optional[dict] = None

class ScheduleItem(BaseModel):
    id: str
    meetingId: str
    meeting: Meeting
    order: int
    estimatedTravelTime: Optional[int] = None
    distance: Optional[int] = None

class RouteOptimizationResponse(BaseModel):
    optimizedSchedule: List[ScheduleItem]
    totalDistance: int
    totalTravelTime: int
    totalDuration: int

class Statistics(BaseModel):
    totalMeetings: int
    completedMeetings: int
    postponedMeetings: int
    cancelledMeetings: int
    totalTasks: int
    completedTasks: int
    pendingTasks: int
    totalClients: int
    vipClients: int
    standardClients: int

# Database connection
def get_conn():
    return psycopg2.connect(**DB_CONFIG)

# Password hashing
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# JWT token creation
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# JWT token verification
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Authentication endpoints
@app.post("/auth/register", response_model=AuthResponse)
def register(user_data: UserCreate):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            # Check if user already exists
            cur.execute("SELECT id FROM users WHERE email = %s", (user_data.email,))
            if cur.fetchone():
                raise HTTPException(status_code=400, detail="User with this email already exists")
            
            # Create new user
            user_id = str(uuid4())
            password_hash = hash_password(user_data.password)
            
            cur.execute("""
                INSERT INTO users (id, email, password_hash, first_name, last_name, role)
                VALUES (%s, %s, %s, %s, %s, 'employee')
                RETURNING id, email, first_name, last_name, role;
            """, (user_id, user_data.email, password_hash, user_data.firstName, user_data.lastName))
            
            user = cur.fetchone()
            conn.commit()
            
            # Create token
            token = create_access_token(data={"sub": user_id})
            
            return AuthResponse(
                token=token,
                user=User(
                    id=user["id"],
                    email=user["email"],
                    firstName=user["first_name"],
                    lastName=user["last_name"],
                    role=user["role"]
                )
            )

@app.post("/auth/login", response_model=AuthResponse)
def login(credentials: UserLogin):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            password_hash = hash_password(credentials.password)
            
            cur.execute("""
                SELECT id, email, first_name, last_name, role FROM users 
                WHERE email = %s AND password_hash = %s AND is_active = TRUE
            """, (credentials.email, password_hash))
            
            user = cur.fetchone()
            if not user:
                raise HTTPException(status_code=401, detail="Invalid credentials")
            
            # Create token
            token = create_access_token(data={"sub": user["id"]})
            
            return AuthResponse(
                token=token,
                user=User(
                    id=user["id"],
                    email=user["email"],
                    firstName=user["first_name"],
                    lastName=user["last_name"],
                    role=user["role"]
                )
            )

@app.post("/auth/logout")
def logout(current_user_id: str = Depends(verify_token)):
    # In a real application, you might want to blacklist the token
    return {"message": "Successfully logged out"}

# Client endpoints
@app.get("/clients", response_model=List[Client])
def get_clients(
    search: Optional[str] = None,
    priority: Optional[str] = None,
    status: Optional[str] = None,
    page: int = 1,
    limit: int = 10,
    current_user_id: str = Depends(verify_token)
):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            query = "SELECT * FROM clients WHERE 1=1"
            params = []
            
            if search:
                query += " AND (first_name ILIKE %s OR last_name ILIKE %s OR email ILIKE %s OR company ILIKE %s)"
                search_param = f"%{search}%"
                params.extend([search_param, search_param, search_param, search_param])
            
            if priority:
                query += " AND priority = %s"
                params.append(priority)
            
            if status:
                query += " AND status = %s"
                params.append(status)
            
            query += " ORDER BY created_at DESC LIMIT %s OFFSET %s"
            params.extend([limit, (page - 1) * limit])
            
            cur.execute(query, params)
            clients = cur.fetchall()
            
            return [
                Client(
                    id=str(client["id"]),
                    firstName=client["first_name"],
                    lastName=client["last_name"],
                    email=client["email"],
                    phone=client["phone"],
                    company=client["company"],
                    position=client["position"],
                    address=client["address"],
                    latitude=float(client["latitude"]) if client["latitude"] else None,
                    longitude=float(client["longitude"]) if client["longitude"] else None,
                    priority=client["priority"],
                    status=client["status"],
                    createdAt=client["created_at"].isoformat(),
                    updatedAt=client["updated_at"].isoformat()
                ) for client in clients
            ]

@app.post("/clients", response_model=Client)
def create_client(client_data: ClientCreate, current_user_id: str = Depends(verify_token)):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            client_id = str(uuid4())
            
            cur.execute("""
                INSERT INTO clients (id, first_name, last_name, email, phone, company, position, address, priority)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *;
            """, (
                client_id, client_data.firstName, client_data.lastName, client_data.email,
                client_data.phone, client_data.company, client_data.position, client_data.address, client_data.priority
            ))
            
            client = cur.fetchone()
            conn.commit()
            
            return Client(
                id=str(client["id"]),
                firstName=client["first_name"],
                lastName=client["last_name"],
                email=client["email"],
                phone=client["phone"],
                company=client["company"],
                position=client["position"],
                address=client["address"],
                latitude=float(client["latitude"]) if client["latitude"] else None,
                longitude=float(client["longitude"]) if client["longitude"] else None,
                priority=client["priority"],
                status=client["status"],
                createdAt=client["created_at"].isoformat(),
                updatedAt=client["updated_at"].isoformat()
            )

@app.get("/clients/{client_id}", response_model=Client)
def get_client(client_id: str, current_user_id: str = Depends(verify_token)):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM clients WHERE id = %s", (client_id,))
            client = cur.fetchone()
            
            if not client:
                raise HTTPException(status_code=404, detail="Client not found")
            
            return Client(
                id=str(client["id"]),
                firstName=client["first_name"],
                lastName=client["last_name"],
                email=client["email"],
                phone=client["phone"],
                company=client["company"],
                position=client["position"],
                address=client["address"],
                latitude=float(client["latitude"]) if client["latitude"] else None,
                longitude=float(client["longitude"]) if client["longitude"] else None,
                priority=client["priority"],
                status=client["status"],
                createdAt=client["created_at"].isoformat(),
                updatedAt=client["updated_at"].isoformat()
            )

@app.put("/clients/{client_id}", response_model=Client)
def update_client(client_id: str, client_data: ClientCreate, current_user_id: str = Depends(verify_token)):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("""
                UPDATE clients 
                SET first_name = %s, last_name = %s, email = %s, phone = %s, 
                    company = %s, position = %s, address = %s, priority = %s
                WHERE id = %s
                RETURNING *;
            """, (
                client_data.firstName, client_data.lastName, client_data.email,
                client_data.phone, client_data.company, client_data.position,
                client_data.address, client_data.priority, client_id
            ))
            
            client = cur.fetchone()
            if not client:
                raise HTTPException(status_code=404, detail="Client not found")
            
            conn.commit()
            
            return Client(
                id=str(client["id"]),
                firstName=client["first_name"],
                lastName=client["last_name"],
                email=client["email"],
                phone=client["phone"],
                company=client["company"],
                position=client["position"],
                address=client["address"],
                latitude=float(client["latitude"]) if client["latitude"] else None,
                longitude=float(client["longitude"]) if client["longitude"] else None,
                priority=client["priority"],
                status=client["status"],
                createdAt=client["created_at"].isoformat(),
                updatedAt=client["updated_at"].isoformat()
            )

@app.delete("/clients/{client_id}")
def delete_client(client_id: str, current_user_id: str = Depends(verify_token)):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM clients WHERE id = %s RETURNING id", (client_id,))
            deleted = cur.fetchone()
            if not deleted:
                raise HTTPException(status_code=404, detail="Client not found")
            conn.commit()
    return {"message": "Client deleted successfully"}

# Task endpoints
@app.get("/tasks", response_model=List[Task])
def get_tasks(
    search: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    clientId: Optional[str] = None,
    employeeId: Optional[str] = None,
    page: int = 1,
    limit: int = 10,
    current_user_id: str = Depends(verify_token)
):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            query = """
                SELECT t.*, c.first_name || ' ' || c.last_name as client_name,
                       u.first_name || ' ' || u.last_name as employee_name
                FROM tasks t
                LEFT JOIN clients c ON t.client_id = c.id
                LEFT JOIN users u ON t.employee_id = u.id
                WHERE 1=1
            """
            params = []
            
            if search:
                query += " AND (t.title ILIKE %s OR t.description ILIKE %s)"
                search_param = f"%{search}%"
                params.extend([search_param, search_param])
            
            if status:
                query += " AND t.status = %s"
                params.append(status)
            
            if priority:
                query += " AND t.priority = %s"
                params.append(priority)
            
            if clientId:
                query += " AND t.client_id = %s"
                params.append(clientId)
            
            if employeeId:
                query += " AND t.employee_id = %s"
                params.append(employeeId)
            
            query += " ORDER BY t.created_at DESC LIMIT %s OFFSET %s"
            params.extend([limit, (page - 1) * limit])
            
            cur.execute(query, params)
            tasks = cur.fetchall()
            
            return [
                Task(
                    id=str(task["id"]),
                    title=task["title"],
                    description=task["description"],
                    clientId=str(task["client_id"]),
                    clientName=task["client_name"],
                    employeeId=str(task["employee_id"]),
                    employeeName=task["employee_name"],
                    status=task["status"],
                    priority=task["priority"],
                    startDate=task["start_date"].isoformat(),
                    endDate=task["end_date"].isoformat(),
                    createdAt=task["created_at"].isoformat(),
                    updatedAt=task["updated_at"].isoformat()
                ) for task in tasks
            ]

@app.post("/tasks", response_model=Task)
def create_task(task_data: TaskCreate, current_user_id: str = Depends(verify_token)):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            task_id = str(uuid4())
            
            cur.execute("""
                INSERT INTO tasks (id, title, description, client_id, employee_id, status, priority, start_date, end_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *;
            """, (
                task_id, task_data.title, task_data.description, task_data.clientId,
                task_data.employeeId, task_data.status, task_data.priority,
                task_data.startDate, task_data.endDate
            ))
            
            task = cur.fetchone()
            conn.commit()
            
            return Task(
                id=str(task["id"]),
                title=task["title"],
                description=task["description"],
                clientId=str(task["client_id"]),
                employeeId=str(task["employee_id"]),
                status=task["status"],
                priority=task["priority"],
                startDate=task["start_date"].isoformat(),
                endDate=task["end_date"].isoformat(),
                createdAt=task["created_at"].isoformat(),
                updatedAt=task["updated_at"].isoformat()
            )

@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: str, current_user_id: str = Depends(verify_token)):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("""
                SELECT t.*, c.first_name || ' ' || c.last_name as client_name,
                       u.first_name || ' ' || u.last_name as employee_name
                FROM tasks t
                LEFT JOIN clients c ON t.client_id = c.id
                LEFT JOIN users u ON t.employee_id = u.id
                WHERE t.id = %s
            """, (task_id,))
            
            task = cur.fetchone()
            if not task:
                raise HTTPException(status_code=404, detail="Task not found")
            
            return Task(
                id=str(task["id"]),
                title=task["title"],
                description=task["description"],
                clientId=str(task["client_id"]),
                clientName=task["client_name"],
                employeeId=str(task["employee_id"]),
                employeeName=task["employee_name"],
                status=task["status"],
                priority=task["priority"],
                startDate=task["start_date"].isoformat(),
                endDate=task["end_date"].isoformat(),
                createdAt=task["created_at"].isoformat(),
                updatedAt=task["updated_at"].isoformat()
            )

@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: str, task_data: TaskCreate, current_user_id: str = Depends(verify_token)):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("""
                UPDATE tasks 
                SET title = %s, description = %s, client_id = %s, employee_id = %s,
                    status = %s, priority = %s, start_date = %s, end_date = %s
                WHERE id = %s
                RETURNING *;
            """, (
                task_data.title, task_data.description, task_data.clientId,
                task_data.employeeId, task_data.status, task_data.priority,
                task_data.startDate, task_data.endDate, task_id
            ))
            
            task = cur.fetchone()
            if not task:
                raise HTTPException(status_code=404, detail="Task not found")
            
            conn.commit()
            
            return Task(
                id=str(task["id"]),
                title=task["title"],
                description=task["description"],
                clientId=str(task["client_id"]),
                employeeId=str(task["employee_id"]),
                status=task["status"],
                priority=task["priority"],
                startDate=task["start_date"].isoformat(),
                endDate=task["end_date"].isoformat(),
                createdAt=task["created_at"].isoformat(),
                updatedAt=task["updated_at"].isoformat()
            )

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str, current_user_id: str = Depends(verify_token)):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM tasks WHERE id = %s RETURNING id", (task_id,))
            deleted = cur.fetchone()
            if not deleted:
                raise HTTPException(status_code=404, detail="Task not found")
            conn.commit()
    return {"message": "Task deleted successfully"}

# Meeting endpoints (extended)
@app.get("/meetings", response_model=List[Meeting])
def get_meetings(
    search: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    clientId: Optional[str] = None,
    employeeId: Optional[str] = None,
    dateFrom: Optional[str] = None,
    dateTo: Optional[str] = None,
    page: int = 1,
    limit: int = 10,
    current_user_id: str = Depends(verify_token)
):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            query = """
                SELECT m.*, c.first_name || ' ' || c.last_name as client_name,
                       u.first_name || ' ' || u.last_name as employee_name,
                       mt.name as meeting_type_name
                FROM meetings m
                LEFT JOIN clients c ON m.client_id = c.id
                LEFT JOIN users u ON m.employee_id = u.id
                LEFT JOIN meeting_types mt ON m.meeting_type_id = mt.id
                WHERE 1=1
            """
            params = []
            
            if search:
                query += " AND (m.title ILIKE %s OR m.description ILIKE %s OR m.location ILIKE %s)"
                search_param = f"%{search}%"
                params.extend([search_param, search_param, search_param])
            
            if status:
                query += " AND m.status = %s"
                params.append(status)
            
            if priority:
                query += " AND m.priority = %s"
                params.append(priority)
            
            if clientId:
                query += " AND m.client_id = %s"
                params.append(clientId)
            
            if employeeId:
                query += " AND m.employee_id = %s"
                params.append(employeeId)
            
            if dateFrom:
                query += " AND m.start_date >= %s"
                params.append(dateFrom)
            
            if dateTo:
                query += " AND m.start_date <= %s"
                params.append(dateTo)
            
            query += " ORDER BY m.start_date ASC LIMIT %s OFFSET %s"
            params.extend([limit, (page - 1) * limit])
            
            cur.execute(query, params)
            meetings = cur.fetchall()
            
            return [
                Meeting(
                    id=str(meeting["id"]),
                    title=meeting["title"],
                    description=meeting["description"],
                    clientId=str(meeting["client_id"]),
                    clientName=meeting["client_name"],
                    employeeId=str(meeting["employee_id"]),
                    employeeName=meeting["employee_name"],
                    meetingTypeId=str(meeting["meeting_type_id"]) if meeting["meeting_type_id"] else None,
                    meetingTypeName=meeting["meeting_type_name"],
                    startDate=meeting["start_date"].isoformat(),
                    endDate=meeting["end_date"].isoformat(),
                    location=meeting["location"],
                    address=meeting["address"],
                    latitude=float(meeting["latitude"]) if meeting["latitude"] else None,
                    longitude=float(meeting["longitude"]) if meeting["longitude"] else None,
                    status=meeting["status"],
                    priority=meeting["priority"],
                    isRecurring=meeting["is_recurring"],
                    recurringPattern=meeting["recurring_pattern"],
                    durationMinutes=meeting["duration_minutes"],
                    orderIndex=meeting["order_index"],
                    createdAt=meeting["created_at"].isoformat(),
                    updatedAt=meeting["updated_at"].isoformat()
                ) for meeting in meetings
            ]

@app.post("/meetings", response_model=Meeting)
def create_meeting(meeting_data: MeetingCreate, current_user_id: str = Depends(verify_token)):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            meeting_id = str(uuid4())
            
            # Calculate duration if not provided
            start_date = datetime.fromisoformat(meeting_data.startDate.replace('Z', '+00:00'))
            end_date = datetime.fromisoformat(meeting_data.endDate.replace('Z', '+00:00'))
            duration_minutes = int((end_date - start_date).total_seconds() / 60)
            
            cur.execute("""
                INSERT INTO meetings (id, title, description, client_id, employee_id, meeting_type_id,
                                    start_date, end_date, location, address, latitude, longitude,
                                    priority, is_recurring, recurring_pattern, duration_minutes)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *;
            """, (
                meeting_id, meeting_data.title, meeting_data.description, meeting_data.clientId,
                meeting_data.employeeId, meeting_data.meetingTypeId, meeting_data.startDate,
                meeting_data.endDate, meeting_data.location, meeting_data.address,
                meeting_data.latitude, meeting_data.longitude, meeting_data.priority,
                meeting_data.isRecurring, meeting_data.recurringPattern, duration_minutes
            ))
            
            meeting = cur.fetchone()
            conn.commit()
            
            return Meeting(
                id=str(meeting["id"]),
                title=meeting["title"],
                description=meeting["description"],
                clientId=str(meeting["client_id"]),
                employeeId=str(meeting["employee_id"]),
                meetingTypeId=str(meeting["meeting_type_id"]) if meeting["meeting_type_id"] else None,
                startDate=meeting["start_date"].isoformat(),
                endDate=meeting["end_date"].isoformat(),
                location=meeting["location"],
                address=meeting["address"],
                latitude=float(meeting["latitude"]) if meeting["latitude"] else None,
                longitude=float(meeting["longitude"]) if meeting["longitude"] else None,
                status=meeting["status"],
                priority=meeting["priority"],
                isRecurring=meeting["is_recurring"],
                recurringPattern=meeting["recurring_pattern"],
                durationMinutes=meeting["duration_minutes"],
                orderIndex=meeting["order_index"],
                createdAt=meeting["created_at"].isoformat(),
                updatedAt=meeting["updated_at"].isoformat()
            )

@app.get("/meetings/{meeting_id}", response_model=Meeting)
def get_meeting(meeting_id: str, current_user_id: str = Depends(verify_token)):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("""
                SELECT m.*, c.first_name || ' ' || c.last_name as client_name,
                       u.first_name || ' ' || u.last_name as employee_name,
                       mt.name as meeting_type_name
                FROM meetings m
                LEFT JOIN clients c ON m.client_id = c.id
                LEFT JOIN users u ON m.employee_id = u.id
                LEFT JOIN meeting_types mt ON m.meeting_type_id = mt.id
                WHERE m.id = %s
            """, (meeting_id,))
            
            meeting = cur.fetchone()
            if not meeting:
                raise HTTPException(status_code=404, detail="Meeting not found")
            
            return Meeting(
                id=str(meeting["id"]),
                title=meeting["title"],
                description=meeting["description"],
                clientId=str(meeting["client_id"]),
                clientName=meeting["client_name"],
                employeeId=str(meeting["employee_id"]),
                employeeName=meeting["employee_name"],
                meetingTypeId=str(meeting["meeting_type_id"]) if meeting["meeting_type_id"] else None,
                meetingTypeName=meeting["meeting_type_name"],
                startDate=meeting["start_date"].isoformat(),
                endDate=meeting["end_date"].isoformat(),
                location=meeting["location"],
                address=meeting["address"],
                latitude=float(meeting["latitude"]) if meeting["latitude"] else None,
                longitude=float(meeting["longitude"]) if meeting["longitude"] else None,
                status=meeting["status"],
                priority=meeting["priority"],
                isRecurring=meeting["is_recurring"],
                recurringPattern=meeting["recurring_pattern"],
                durationMinutes=meeting["duration_minutes"],
                orderIndex=meeting["order_index"],
                createdAt=meeting["created_at"].isoformat(),
                updatedAt=meeting["updated_at"].isoformat()
            )

@app.put("/meetings/{meeting_id}", response_model=Meeting)
def update_meeting(meeting_id: str, meeting_data: MeetingCreate, current_user_id: str = Depends(verify_token)):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            # Calculate duration if not provided
            start_date = datetime.fromisoformat(meeting_data.startDate.replace('Z', '+00:00'))
            end_date = datetime.fromisoformat(meeting_data.endDate.replace('Z', '+00:00'))
            duration_minutes = int((end_date - start_date).total_seconds() / 60)
            
            cur.execute("""
                UPDATE meetings 
                SET title = %s, description = %s, client_id = %s, employee_id = %s,
                    meeting_type_id = %s, start_date = %s, end_date = %s, location = %s,
                    address = %s, latitude = %s, longitude = %s, priority = %s,
                    is_recurring = %s, recurring_pattern = %s, duration_minutes = %s
                WHERE id = %s
                RETURNING *;
            """, (
                meeting_data.title, meeting_data.description, meeting_data.clientId,
                meeting_data.employeeId, meeting_data.meetingTypeId, meeting_data.startDate,
                meeting_data.endDate, meeting_data.location, meeting_data.address,
                meeting_data.latitude, meeting_data.longitude, meeting_data.priority,
                meeting_data.isRecurring, meeting_data.recurringPattern, duration_minutes, meeting_id
            ))
            
            meeting = cur.fetchone()
            if not meeting:
                raise HTTPException(status_code=404, detail="Meeting not found")
            
            conn.commit()
            
            return Meeting(
                id=str(meeting["id"]),
                title=meeting["title"],
                description=meeting["description"],
                clientId=str(meeting["client_id"]),
                employeeId=str(meeting["employee_id"]),
                meetingTypeId=str(meeting["meeting_type_id"]) if meeting["meeting_type_id"] else None,
                startDate=meeting["start_date"].isoformat(),
                endDate=meeting["end_date"].isoformat(),
                location=meeting["location"],
                address=meeting["address"],
                latitude=float(meeting["latitude"]) if meeting["latitude"] else None,
                longitude=float(meeting["longitude"]) if meeting["longitude"] else None,
                status=meeting["status"],
                priority=meeting["priority"],
                isRecurring=meeting["is_recurring"],
                recurringPattern=meeting["recurring_pattern"],
                durationMinutes=meeting["duration_minutes"],
                orderIndex=meeting["order_index"],
                createdAt=meeting["created_at"].isoformat(),
                updatedAt=meeting["updated_at"].isoformat()
            )

@app.delete("/meetings/{meeting_id}")
def delete_meeting(meeting_id: str, current_user_id: str = Depends(verify_token)):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM meetings WHERE id = %s RETURNING id", (meeting_id,))
            deleted = cur.fetchone()
            if not deleted:
                raise HTTPException(status_code=404, detail="Meeting not found")
            conn.commit()
    return {"message": "Meeting deleted successfully"}

# Meeting types endpoints
@app.get("/meeting-types", response_model=List[MeetingType])
def get_meeting_types(current_user_id: str = Depends(verify_token)):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM meeting_types ORDER BY name")
            meeting_types = cur.fetchall()
            
            return [
                MeetingType(
                    id=str(mt["id"]),
                    name=mt["name"],
                    defaultDuration=mt["default_duration"],
                    color=mt["color"],
                    bgColor=mt["bg_color"],
                    borderColor=mt["border_color"],
                    isCustom=mt["is_custom"],
                    createdAt=mt["created_at"].isoformat(),
                    updatedAt=mt["updated_at"].isoformat()
                ) for mt in meeting_types
            ]

@app.post("/meeting-types", response_model=MeetingType)
def create_meeting_type(meeting_type_data: MeetingTypeCreate, current_user_id: str = Depends(verify_token)):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            meeting_type_id = str(uuid4())
            
            cur.execute("""
                INSERT INTO meeting_types (id, name, default_duration, color, bg_color, border_color, is_custom)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING *;
            """, (
                meeting_type_id, meeting_type_data.name, meeting_type_data.defaultDuration,
                meeting_type_data.color, meeting_type_data.bgColor, meeting_type_data.borderColor,
                meeting_type_data.isCustom
            ))
            
            meeting_type = cur.fetchone()
            conn.commit()
            
            return MeetingType(
                id=str(meeting_type["id"]),
                name=meeting_type["name"],
                defaultDuration=meeting_type["default_duration"],
                color=meeting_type["color"],
                bgColor=meeting_type["bg_color"],
                borderColor=meeting_type["border_color"],
                isCustom=meeting_type["is_custom"],
                createdAt=meeting_type["created_at"].isoformat(),
                updatedAt=meeting_type["updated_at"].isoformat()
            )

# Statistics endpoint
@app.get("/statistics", response_model=Statistics)
def get_statistics(current_user_id: str = Depends(verify_token)):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            # Get meeting statistics
            cur.execute("""
                SELECT 
                    COUNT(*) as total_meetings,
                    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_meetings,
                    COUNT(CASE WHEN status = 'postponed' THEN 1 END) as postponed_meetings,
                    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_meetings
                FROM meetings
            """)
            meeting_stats = cur.fetchone()
            
            # Get task statistics
            cur.execute("""
                SELECT 
                    COUNT(*) as total_tasks,
                    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
                    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_tasks
                FROM tasks
            """)
            task_stats = cur.fetchone()
            
            # Get client statistics
            cur.execute("""
                SELECT 
                    COUNT(*) as total_clients,
                    COUNT(CASE WHEN priority = 'vip' THEN 1 END) as vip_clients,
                    COUNT(CASE WHEN priority = 'standard' THEN 1 END) as standard_clients
                FROM clients
            """)
            client_stats = cur.fetchone()
            
            return Statistics(
                totalMeetings=meeting_stats["total_meetings"],
                completedMeetings=meeting_stats["completed_meetings"],
                postponedMeetings=meeting_stats["postponed_meetings"],
                cancelledMeetings=meeting_stats["cancelled_meetings"],
                totalTasks=task_stats["total_tasks"],
                completedTasks=task_stats["completed_tasks"],
                pendingTasks=task_stats["pending_tasks"],
                totalClients=client_stats["total_clients"],
                vipClients=client_stats["vip_clients"],
                standardClients=client_stats["standard_clients"]
            )

# Route optimization endpoint
@app.post("/meetings/optimize-route", response_model=RouteOptimizationResponse)
def optimize_route(request: RouteOptimizationRequest, current_user_id: str = Depends(verify_token)):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            # Get meetings data
            meeting_ids_str = "','".join(request.meetingIds)
            cur.execute(f"""
                SELECT m.*, c.first_name || ' ' || c.last_name as client_name,
                       u.first_name || ' ' || u.last_name as employee_name,
                       mt.name as meeting_type_name
                FROM meetings m
                LEFT JOIN clients c ON m.client_id = c.id
                LEFT JOIN users u ON m.employee_id = u.id
                LEFT JOIN meeting_types mt ON m.meeting_type_id = mt.id
                WHERE m.id IN ('{meeting_ids_str}')
                ORDER BY m.start_date ASC
            """)
            
            meetings = cur.fetchall()
            
            if not meetings:
                raise HTTPException(status_code=404, detail="No meetings found")
            
            # Simple optimization: sort by location proximity (in real app, use proper routing algorithm)
            optimized_schedule = []
            total_distance = 0
            total_travel_time = 0
            total_duration = 0
            
            for i, meeting in enumerate(meetings):
                # Mock travel time and distance (in real app, calculate using routing service)
                travel_time = 15 if i > 0 else 0  # 15 minutes between meetings
                distance = 2500 if i > 0 else 0  # 2.5 km between meetings
                
                # Calculate meeting duration
                start_date = meeting["start_date"]
                end_date = meeting["end_date"]
                meeting_duration = int((end_date - start_date).total_seconds() / 60)
                
                schedule_item = ScheduleItem(
                    id=f"schedule-{meeting['id']}",
                    meetingId=str(meeting["id"]),
                    meeting=Meeting(
                        id=str(meeting["id"]),
                        title=meeting["title"],
                        description=meeting["description"],
                        clientId=str(meeting["client_id"]),
                        clientName=meeting["client_name"],
                        employeeId=str(meeting["employee_id"]),
                        employeeName=meeting["employee_name"],
                        meetingTypeId=str(meeting["meeting_type_id"]) if meeting["meeting_type_id"] else None,
                        meetingTypeName=meeting["meeting_type_name"],
                        startDate=meeting["start_date"].isoformat(),
                        endDate=meeting["end_date"].isoformat(),
                        location=meeting["location"],
                        address=meeting["address"],
                        latitude=float(meeting["latitude"]) if meeting["latitude"] else None,
                        longitude=float(meeting["longitude"]) if meeting["longitude"] else None,
                        status=meeting["status"],
                        priority=meeting["priority"],
                        isRecurring=meeting["is_recurring"],
                        recurringPattern=meeting["recurring_pattern"],
                        durationMinutes=meeting["duration_minutes"],
                        orderIndex=meeting["order_index"],
                        createdAt=meeting["created_at"].isoformat(),
                        updatedAt=meeting["updated_at"].isoformat()
                    ),
                    order=i + 1,
                    estimatedTravelTime=travel_time,
                    distance=distance
                )
                
                optimized_schedule.append(schedule_item)
                total_distance += distance
                total_travel_time += travel_time
                total_duration += meeting_duration
            
            return RouteOptimizationResponse(
                optimizedSchedule=optimized_schedule,
                totalDistance=total_distance,
                totalTravelTime=total_travel_time,
                totalDuration=total_duration + total_travel_time
            )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)