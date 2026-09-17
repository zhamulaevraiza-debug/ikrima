import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen, ScreenBody, ScreenHeader } from '../components/Screen'
import { Tap } from '../components/Tap'
import { Logo } from '../components/Logo'
import { PhotoPlaceholder } from '../components/PhotoPlaceholder'
import { SearchIcon } from '../components/icons'
import { CATALOG_FILTERS } from '../data/seed'
import { useApp } from '../store/AppContext'
import {
  AMBER,
  FONT_DISPLAY,
  INK,
  PAPER,
  YEL,
  YELLOW_WASH,
  hatch,
  ink,
  safeTop,
} from '../styles/tokens'

/**
 * Lets the browser decide whether this focus deserves a ring — which for a
 * text field means yes, by pointer or by key, exactly as the design's own
 * `input:focus` rule intended. Engines that do not know `:focus-visible` throw
 * on `matches`; they get the ring too, rather than none at all.
 */
function focusDeservesRing(el: HTMLElement) {
  try {
    return el.matches(':focus-visible')
  } catch {
    return true
  }
}

/** The shop front: search, filters, the tailoring pitch and the size grid. */
export function CatalogScreen() {
  const navigate = useNavigate()
  const { t, cartCount, search, setSearch, filter, setFilter, visibleProducts, sizesOf, price } =
    useApp()
  // The input carries no border of its own, and the stylesheet clears the
  // outline on every focused input, so the box draws the focus ring itself —
  // without it the search field is the one control with no focus state.
  const [searchRing, setSearchRing] = useState(false)

  return (
    <Screen>
      <ScreenHeader
        style={{
          padding: `${safeTop(18)} 20px 18px`,
          background: YEL,
          backgroundImage: YELLOW_WASH,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo tagline={t('Индивидуальный пошив')} />
          <Tap
            aria-label={`${t('Корзина')} · ${cartCount}`}
            onClick={() => navigate('/cart')}
            style={{
              marginLeft: 'auto',
              width: 38,
              height: 38,
              flex: 'none',
              borderRadius: '50%',
              border: `1.2px solid ${ink(0.35)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {cartCount}
          </Tap>
        </div>

        <div
          style={{
            marginTop: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: PAPER,
            border: `1.2px solid ${INK}`,
            borderRadius: 10,
            padding: '11px 13px',
            outline: searchRing ? `2px solid ${INK}` : undefined,
            outlineOffset: 2,
          }}
        >
          <span style={{ flex: 'none', display: 'flex', color: INK }}>
            <SearchIcon />
          </span>
          {/* The prototype drew a dead <div> here; live search is what the box promises. */}
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={(e) => setSearchRing(focusDeservesRing(e.currentTarget))}
            onBlur={() => setSearchRing(false)}
            placeholder={t('Камис, штаны, размер')}
            aria-label={t('Камис, штаны, размер')}
            style={{
              flex: 1,
              minWidth: 0,
              appearance: 'none',
              WebkitAppearance: 'none',
              border: 'none',
              background: 'transparent',
              padding: 0,
              fontSize: 13.5,
              color: INK,
            }}
          />
        </div>
      </ScreenHeader>

      <ScreenBody style={{ padding: '16px 0 24px' }}>
        <div className="scroll" style={{ display: 'flex', gap: 8, padding: '0 20px', overflowX: 'auto' }}>
          {CATALOG_FILTERS.map((label) => {
            const isFabrics = label === 'Ткани'
            const active = filter === label
            return (
              <Tap
                key={label}
                aria-pressed={isFabrics ? undefined : active}
                onClick={() => (isFabrics ? navigate('/fabrics') : setFilter(label))}
                style={{
                  flex: 'none',
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: active ? INK : ink(0.07),
                  color: active ? YEL : INK,
                  fontSize: 12.5,
                  fontWeight: 600,
                }}
              >
                {t(label)}
              </Tap>
            )
          })}
        </div>

        <Tap
          onClick={() => navigate('/measure')}
          style={{
            margin: '16px 20px 0',
            padding: 16,
            width: 'calc(100% - 40px)',
            boxSizing: 'border-box',
            border: `1.4px solid ${INK}`,
            borderRadius: 14,
            background: '#fff',
            display: 'flex',
            gap: 14,
            alignItems: 'center',
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 17, lineHeight: 1.25 }}>
              {t('Мерки снимаем с вашей одежды')}
            </div>
            <div style={{ marginTop: 5, fontSize: 12, lineHeight: 1.45, color: ink(0.6) }}>
              Измерьте вещь, которая хорошо сидит. Остальное — на примерке в с. Шатой
            </div>
            <div
              style={{
                marginTop: 11,
                display: 'inline-flex',
                padding: '9px 15px',
                borderRadius: 9,
                background: INK,
                color: YEL,
                fontSize: 12.5,
                fontWeight: 700,
              }}
            >
              {t('Мерки с одежды', 'cta')}
            </div>
          </div>
          <div
            // A hatched stand-in for the diagram: nothing for a reader to hear.
            aria-hidden="true"
            style={{
              width: 74,
              height: 92,
              flex: 'none',
              border: `1.2px dashed ${ink(0.4)}`,
              borderRadius: 8,
              background: hatch(0.05, 5),
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: 6,
              fontSize: 8.5,
              color: ink(0.6),
              textAlign: 'center',
            }}
          >
            <span>
              схема
              <br />
              обмера
            </span>
          </div>
        </Tap>

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            margin: '24px 20px 12px',
          }}
        >
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 19 }}>{t('Готовые размеры')}</div>
          <Tap
            onClick={() => navigate('/portfolio')}
            style={{ fontSize: 12, color: ink(0.62), fontWeight: 600 }}
          >
            {t('Портфолио →')}
          </Tap>
        </div>

        {visibleProducts.length === 0 ? (
          // Search runs as you type, so the result has to be spoken, not just drawn.
          <div role="status" style={{ padding: '0 20px' }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 17, lineHeight: 1.25 }}>
              Ничего не нашлось
            </div>
            <div style={{ marginTop: 5, fontSize: 12, lineHeight: 1.45, color: ink(0.6) }}>
              Попробуйте другое слово или уберите фильтр
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 14,
              padding: '0 20px',
            }}
          >
            {visibleProducts.map((p) => {
              const sizes = sizesOf(p.name)
              return (
                <Tap
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  style={{ display: 'flex', flexDirection: 'column', gap: 7, width: '100%', minWidth: 0 }}
                >
                  <PhotoPlaceholder caption={p.ph} style={{ aspectRatio: '3/4', width: '100%' }} />
                  <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.3 }}>{p.name}</div>
                  <div style={{ fontSize: 11.5, color: sizes.length ? ink(0.65) : AMBER }}>
                    {sizes.length ? `в наличии ${sizes.join(', ')}` : t('только на пошив')}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{price(p.price)}</div>
                </Tap>
              )
            })}
          </div>
        )}
      </ScreenBody>
    </Screen>
  )
}
