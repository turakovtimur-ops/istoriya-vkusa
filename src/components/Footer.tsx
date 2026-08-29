export default function Footer() {
  return (
    <footer className="bg-graphite text-cream py-16 lg:py-24">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <span className="font-serif text-4xl font-medium mb-4 block">КИН<span className="text-terra">Z</span>A</span>
            <p className="text-cream/60 text-sm font-light leading-relaxed">Ресторан грузинской кухни<br />на берегу Чёрного моря</p>
          </div>
          <div>
            <p className="text-xs text-cream/40 uppercase tracking-[0.3em] mb-4">Разделы</p>
            <ul className="space-y-2 text-cream/70 font-light">
              <li><a href="#about" className="hover:text-cream transition-colors">Ресторан</a></li>
              <li><a href="#menu" className="hover:text-cream transition-colors">Меню</a></li>
              <li><a href="#gallery" className="hover:text-cream transition-colors">Галерея</a></li>
              <li><a href="#banquets" className="hover:text-cream transition-colors">Банкеты</a></li>
              <li><a href="#reviews" className="hover:text-cream transition-colors">Отзывы</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs text-cream/40 uppercase tracking-[0.3em] mb-4">Контакты</p>
            <ul className="space-y-2 text-cream/70 font-light">
              <li>Геленджик</li>
              <li>ул. Революционная, 22а</li>
              <li><a href="tel:+79384095855" className="hover:text-cream transition-colors">+7 (938) 409-58-55</a></li>
              <li><a href="mailto:kinza.rest.gel@gmail.com" className="hover:text-cream transition-colors">kinza.rest.gel@gmail.com</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs text-cream/40 uppercase tracking-[0.3em] mb-4">Соцсети</p>
            <ul className="space-y-2 text-cream/70 font-light">
              <li><a href="https://www.instagram.com/kinza_rest_gel/" target="_blank" rel="noopener noreferrer" className="hover:text-cream transition-colors">Instagram</a></li>
              <li><a href="https://vk.com/kinzagelendzhik" target="_blank" rel="noopener noreferrer" className="hover:text-cream transition-colors">VK</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-10 border-t border-cream/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-cream/50 text-xs">© 2026 Ресторан Кинза. Все права защищены.</p>
          <div className="flex gap-6 text-cream/50 text-xs">
            <a href="#" className="hover:text-cream transition-colors">Пользовательское соглашение</a>
            <a href="#" className="hover:text-cream transition-colors">Политика конфиденциальности</a>
          </div>
        </div>
        <p className="mt-10 text-cream/30 text-[11px] leading-relaxed max-w-4xl">
          Данный интернет-сайт носит исключительно информационный и рекламный характер
          и ни при каких условиях не является публичной офертой, определяемой положениями
          Статьи 437 (2) Гражданского кодекса Российской Федерации.
        </p>
      </div>
    </footer>
  );
}