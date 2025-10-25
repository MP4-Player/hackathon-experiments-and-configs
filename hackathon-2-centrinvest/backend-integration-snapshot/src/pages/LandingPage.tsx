import { Link } from 'react-router-dom'
import { 
  MapPin, 
  Calendar, 
  CheckSquare, 
  BarChart3, 
  Shield,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Zap,
  Target
} from 'lucide-react'
import { useState } from 'react'
import { AnimatedBackground } from '@/components/ui/AnimatedBackground'
import { Kaleidoscope } from '@/components/ui/Kaleidoscope'

export const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const features = [
    {
      icon: <MapPin className="h-12 w-12 text-primary-600" />,
      title: 'Отслеживание местоположения',
      description: 'Отслеживайте местоположение встреч и находите кратчайший путь к клиентам',
      gradient: 'from-primary-400 to-primary-600',
      animation: 'float'
    },
    {
      icon: <Calendar className="h-12 w-12 text-accent-600" />,
      title: 'Управление встречами',
      description: 'Планируйте и управляйте встречами с автоматическим построением маршрутов',
      gradient: 'from-accent-400 to-accent-600',
      animation: 'pulse-slow'
    },
    {
      icon: <CheckSquare className="h-12 w-12 text-primary-600" />,
      title: 'Управление задачами',
      description: 'Создавайте, назначайте и отслеживайте выполнение задач',
      gradient: 'from-primary-400 to-accent-500',
      animation: ''
    },
    {
      icon: <BarChart3 className="h-12 w-12 text-accent-600" />,
      title: 'Детальная отчетность',
      description: 'Получайте подробную статистику по встречам, задачам и эффективности',
      gradient: 'from-accent-400 to-primary-500',
      animation: ''
    },
    {
      icon: <Shield className="h-12 w-12 text-secondary-600" />,
      title: 'Безопасность данных',
      description: 'Надежная защита корпоративных данных с шифрованием и контролем доступа',
      gradient: 'from-secondary-400 to-accent-500',
      animation: 'float'
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Анимированный фон */}
      <AnimatedBackground />
      
      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-3">
                <img 
                  src="/src/assets/images/logo.png" 
                  alt="ЦентрИнвест" 
                  className="h-10 w-10 object-contain"
                />
                <div>
                  <h1 className="text-3xl font-display font-bold text-gradient">ЦентрИнвест</h1>
                  <p className="text-sm text-text-secondary">Управление встречами</p>
                </div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-500 hover:text-gray-900">Возможности</a>
              <a href="#about" className="text-gray-500 hover:text-gray-900">О нас</a>
              <a href="#contact" className="text-gray-500 hover:text-gray-900">Контакты</a>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-500 hover:text-gray-900 font-medium"
              >
                Войти
              </Link>
              <Link
                to="/register"
                className="btn-primary"
              >
                Зарегистрироваться
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-500 hover:text-gray-900"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a href="#features" className="block px-3 py-2 text-gray-500 hover:text-gray-900">Возможности</a>
                <a href="#about" className="block px-3 py-2 text-gray-500 hover:text-gray-900">О нас</a>
                <a href="#contact" className="block px-3 py-2 text-gray-500 hover:text-gray-900">Контакты</a>
                <div className="pt-4 space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-500 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Войти
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 bg-primary-600 text-white rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Зарегистрироваться
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-white/80">
                  <Sparkles className="h-6 w-6 animate-pulse text-white" />
                  <span className="text-sm font-medium">Инновационное решение</span>
                </div>
                <h1 className="hero-title">
                  Эффективное управление временем и бизнесом на одной платформе
                </h1>
                <p className="text-xl text-white/90 leading-relaxed">
                  Автоматизируйте задачи, отслеживайте местоположение встреч и кратчайший путь, 
                  повышайте производительность вашего бизнеса.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
                >
                  <Zap className="inline-block mr-2 h-5 w-5 group-hover:animate-pulse" />
                  Создать аккаунт
                  <ArrowRight className="inline-block ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#features"
                  className="bg-white/20 backdrop-blur-md border-2 border-white/50 text-white hover:bg-white/30 hover:text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
                >
                  <Target className="inline-block mr-2 h-5 w-5 group-hover:animate-spin" />
                  Подробнее о функциях
                </a>
              </div>

              {/* Статистика */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">1000+</div>
                  <div className="text-sm text-white/70">Активных пользователей</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">50K+</div>
                  <div className="text-sm text-white/70">Встреч проведено</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">99%</div>
                  <div className="text-sm text-white/70">Довольных клиентов</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl p-8 text-gray-900">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold">Дашборд управления встречами</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600">24</div>
                      <div className="text-sm text-gray-600">Встречи сегодня</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">18</div>
                      <div className="text-sm text-gray-600">Завершено</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Встреча с клиентом А</span>
                      <span className="text-xs text-gray-500">14:00</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Презентация проекта</span>
                      <span className="text-xs text-gray-500">16:30</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 bg-gradient-to-b from-surface to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 text-primary-600 mb-4">
              <Sparkles className="h-6 w-6 animate-pulse text-primary-600" />
              <span className="text-sm font-medium">Возможности</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-gradient mb-6">
              Наши возможности
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Комплексное решение для управления встречами, клиентами и задачами
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`card card-hover p-8 group border-2 border-gray-200`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`mb-6 p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white ${feature.animation} relative overflow-hidden`}>
                  {feature.icon}
                  {/* Декоративные элементы */}
                  <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 bg-white/30 rounded-full animate-bounce-slow"></div>
                </div>
                <h3 className={`text-2xl font-semibold mb-4 transition-colors ${
                  feature.title === 'Детальная отчетность' 
                    ? 'text-gray-700 group-hover:text-gray-800' 
                    : 'text-gray-800 group-hover:text-primary-700'
                }`}>
                  {feature.title}
                </h3>
                <p className={`leading-relaxed ${
                  feature.title === 'Детальная отчетность' 
                    ? 'text-gray-600' 
                    : 'text-gray-700'
                }`}>
                  {feature.description}
                </p>
                <div className="mt-6 flex items-center text-primary-600 font-medium group-hover:translate-x-2 transition-transform">
                  <span> </span>
                 
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="relative z-10 py-24 bg-gradient-to-b from-surface to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 text-primary-600 mb-4">
              <Sparkles className="h-6 w-6 animate-pulse text-primary-600" />
              <span className="text-sm font-medium">Дашборд</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-gradient mb-6">
              Интерактивный дашборд
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Управляйте всеми аспектами бизнеса через интуитивный интерфейс
            </p>
          </div>
          
          {/* Калейдоскоп дашборда */}
          <div className="max-w-4xl mx-auto mb-16">
            <Kaleidoscope />
          </div>

          {/* Дополнительные функции */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden">
                <img 
                  src="/src/assets/images/analytics-meetings.jpg" 
                  alt="Статистика встреч"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Статистика встреч</h3>
              <p className="text-text-secondary">Сохранение историй ваших встреч</p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden">
                <img 
                  src="/src/assets/images/task-planner.jpg" 
                  alt="Планировщик задач"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Планировщик задач</h3>
              <p className="text-text-secondary">Создание и отслеживание задач</p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-300 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden">
                <img 
                  src="/src/assets/images/route-map.jpg" 
                  alt="Карта маршрутов"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Карта маршрутов</h3>
              <p className="text-text-secondary">Оптимизация маршрутов встреч</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}

{/* Footer */}
<footer className="relative z-10 bg-gradient-to-br from-text-primary to-gray-800 text-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="space-y-4">
        <h3 className="text-2xl font-display font-bold text-gradient">ЦентрИнвест</h3>
        <p className="text-gray-300 leading-relaxed">
          Управление встречами и бизнес-процессами нового поколения
        </p>
        <div className="mb-4">
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold mb-6 text-white">Продукт</h4>
        <ul className="space-y-3">
          <li><a href="#features" className="text-gray-300 hover:text-accent-400 transition-colors">Возможности</a></li>
        </ul>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold mb-6 text-white">Поддержка</h4>
        <ul className="space-y-3">
          <li><a href="#" className="text-gray-300 hover:text-accent-400 transition-colors">Помощь</a></li>
          <p className="text-white font-semibold">8 800 200 99 29</p>
          <li><a href="#" className="text-gray-300 hover:text-accent-400 transition-colors">Контакты</a></li>
        </ul>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold mb-6 text-white">Следить за нами</h4>
        <div className="flex space-x-4 mb-6">
          {/* ВКонтакте */}
          <a 
            href="https://vk.com/center-invest" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 bg-[#0077FF] rounded-full flex items-center justify-center hover:bg-[#0066DD] transition-colors cursor-pointer"
            title="ВКонтакте"
          >
            <img 
              src="/src/assets/images/vk.png" 
              alt="VK" 
              className="w-5 h-5"
            />
          </a>
          
          {/* Одноклассники */}
          <a 
            href="https://ok.ru/center-invest" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 bg-[#EE8208] rounded-full flex items-center justify-center hover:bg-[#D67307] transition-colors cursor-pointer"
            title="Одноклассники"
          >
            <img 
              src="/src/assets/images/ok.png" 
              alt="OK" 
              className="w-5 h-5 "
            />
          </a>
          
          {/* YouTube */}
          <a 
            href="https://youtube.com/center-invest" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 bg-[#FF0000] rounded-full flex items-center justify-center hover:bg-[#DD0000] transition-colors cursor-pointer"
            title="YouTube"
          >
            <img 
              src="/src/assets/images/yt.png" 
              alt="YouTube" 
              className="w-5 h-5 "
            />
          </a>
        </div>
        
        <p className="text-gray-300 text-sm mb-2">Будьте в курсе новостей</p>
        <p className="text-gray-400 text-xs">Подпишитесь на наши соцсети</p>
      </div>
    </div>
    
    <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
      <p className="text-gray-400">&copy; 2025 ЦентрИнвест. Все права защищены.</p>
      <div className="flex items-center space-x-2 mt-4 md:mt-0">
        <span className="text-gray-400">Сделано с</span>
        <div className="w-4 h-4 text-accent-400 animate-pulse">❤️</div>
        <span className="text-gray-400">в России</span>
      </div>
    </div>
  </div>
</footer>
    </div>
  )
}
