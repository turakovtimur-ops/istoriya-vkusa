interface Props { onBook: () => void; }

export default function Contact({ onBook }: Props) {
  return (
    <section id="contacts" className="py-24 lg:py-40 bg-sand/40">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <p className="reveal text-terra text-xs tracking-[0.3em] uppercase mb-6 font-medium">Контакты</p>
            <h2 className="reveal reveal-delay-1 font-serif text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] text-graphite mb-12">
              Ждём вас<br /><em className="text-forest">в гости.</em>
            </h2>
            <div className="reveal reveal-delay-2 space-y-10">
              <div>
                <p className="text-xs text-muted uppercase tracking-[0.3em] mb-2">Адрес</p>
                <p className="font-serif text-2xl lg:text-3xl text-graphite">Геленджик<br />ул. Революционная, 22а</p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-[0.3em] mb-2">Телефон</p>
                <a href="tel:+79384095855" className="font-serif text-2xl lg:text-3xl text-graphite hover:text-terra transition-colors">+7 (938) 409-58-55</a>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-[0.3em] mb-2">Email</p>
                <a href="mailto:kinza.rest.gel@gmail.com" className="font-serif text-xl lg:text-2xl text-graphite hover:text-terra transition-colors break-all">kinza.rest.gel@gmail.com</a>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-[0.3em] mb-2">Часы работы</p>
                <p className="font-serif text-xl lg:text-2xl text-graphite">Ежедневно · 10:00 – 01:00</p>
              </div>
            </div>
            <div className="reveal reveal-delay-3 flex flex-wrap gap-3 mt-12">
              <a href="tel:+79384095855" className="btn-primary">Позвонить</a>
              <a href="https://yandex.ru/maps/?rtext=44.5551,38.0687" target="_blank" rel="noopener noreferrer" className="btn-primary bg-forest">Маршрут</a>
              <button onClick={onBook} className="btn-terra">Забронировать</button>
            </div>
            <div className="reveal reveal-delay-4 mt-16 pt-10 border-t border-graphite/10">
              <p className="text-xs text-muted uppercase tracking-[0.3em] mb-4">Мы в соцсетях</p>
              <div className="flex gap-6">
                <a href="https://www.instagram.com/kinza_rest_gel/" target="_blank" rel="noopener noreferrer" className="text-graphite hover:text-terra transition-colors font-serif text-lg">Instagram</a>
                <a href="https://vk.com/kinzagelendzhik" target="_blank" rel="noopener noreferrer" className="text-graphite hover:text-terra transition-colors font-serif text-lg">VK</a>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 reveal reveal-delay-2">
            <div className="relative aspect-[4/3] lg:aspect-[5/6] bg-graphite overflow-hidden">
              <iframe src="https://yandex.ru/map-widget/v1/?ll=38.0687%2C44.5551&mode=search&oid=17647113856&ol=biz&z=17"
                width="100%" height="100%" frameBorder="0"
                style={{ border: 0, filter: 'grayscale(1) invert(0.92) contrast(0.9)' }}
                loading="lazy" title="Ресторан КИНZA на карте" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}