import { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ActionBar, Screen, ScreenBody, ScreenHeader } from '../components/Screen'
import { BackBar } from '../components/BackBar'
import { FabricSwatches } from '../components/FabricSwatches'
import { PhotoPlaceholder } from '../components/PhotoPlaceholder'
import { Tap } from '../components/Tap'
import { useApp } from '../store/AppContext'
import { FONT_BODY, FONT_DISPLAY, INK, PAPER, YEL, ink, safeTop } from '../styles/tokens'

/** One model: photo, price, the sizes made up right now, fabric and the two ways to buy. */
export function ProductScreen() {
  const navigate = useNavigate()
  const { data, selectProduct, size, selectSize, sizesOf, price, t, cartCount, addToCart, showToast } =
    useApp()
  const { productId } = useParams<{ productId: string }>()

  useEffect(() => {
    if (productId) selectProduct(productId)
    // selectProduct is rebuilt on every render, so only the id may re-run this.
  }, [productId])

  // Read the model straight from the URL rather than from the store's
  // `product`: the store is synced in the effect above and would otherwise
  // show the previous model for one frame.
  const product = data.products.find((p) => p.id === productId)
  if (!product) return <Navigate to="/" replace />

  const allSizes = Object.keys(data.stock[product.name] ?? {})
  const inStock = sizesOf(product.name)
  // The store keeps one chosen size for the whole session, and the effect above
  // only re-points it at this model after the first paint. Until then it can
  // still hold a size this model is not made in, so never show — or add to the
  // cart — a size that is not on this card.
  const chosenSize = size && allSizes.includes(size) ? size : null
  const canBuy = inStock.length > 0 && chosenSize !== null

  const buyLabel = inStock.length
    ? chosenSize
      ? `В корзину · ${chosenSize}`
      : t('Выберите размер')
    : t('Нет в наличии')

  const buy = () => {
    if (!inStock.length) return showToast('Этой модели нет в наличии — оформите пошив')
    if (!chosenSize) return showToast('Выберите размер')
    addToCart(product, chosenSize)
  }

  return (
    <Screen>
      <ScreenHeader style={{ padding: `${safeTop(18)} 18px 12px`, background: PAPER }}>
        <BackBar
          to="/"
          title={
            // The card names the model in small body type, not the display face
            // BackBar sets for its own titles.
            <span
              style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: ink(0.6) }}
            >
              {product.name}
            </span>
          }
          trailing={
            <Tap
              onClick={() => navigate('/cart')}
              style={{ marginLeft: 'auto', fontSize: 12.5, fontWeight: 700 }}
            >
              {t('Корзина')} · {cartCount}
            </Tap>
          }
        />
      </ScreenHeader>

      <ScreenBody style={{ padding: '0 18px 24px' }}>
        <PhotoPlaceholder
          caption={product.ph}
          radius={14}
          step={7}
          alpha={0.05}
          style={{ height: 326, padding: 12, fontSize: 10 }}
        />

        <div style={{ marginTop: 16, fontFamily: FONT_DISPLAY, fontSize: 24, lineHeight: 1.2 }}>
          {product.name}
        </div>

        <div style={{ marginTop: 8, display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {[product.form, product.fabric].map((label) => (
            <div
              key={label}
              style={{
                padding: '5px 10px',
                borderRadius: 999,
                background: ink(0.07),
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, fontFamily: FONT_DISPLAY, fontSize: 26 }}>
          {inStock.length ? price(product.price) : price(product.sew || product.price)}
        </div>
        <div style={{ marginTop: 4, fontSize: 11.5, color: ink(0.65) }}>
          {t('оплата при получении')}
        </div>

        <div style={{ marginTop: 22, fontSize: 12.5, fontWeight: 700 }}>
          {t('Готовые размеры')}
        </div>
        {allSizes.length > 0 && (
          <div style={{ marginTop: 9, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {allSizes.map((label) => {
              const available = data.stock[product.name][label]
              const selected = chosenSize === label
              return (
                <Tap
                  key={label}
                  aria-pressed={selected}
                  // A sold-out size is greyed out in the design; say so out loud
                  // too, but keep the chip tappable — the tap is what explains
                  // that the model can still be sewn to measure.
                  aria-disabled={!available || undefined}
                  aria-label={available ? undefined : `${label} — ${t('Нет в наличии')}`}
                  onClick={() =>
                    available
                      ? selectSize(label)
                      : showToast(`Размера ${label} сейчас нет — можно сшить на заказ`)
                  }
                  style={{
                    padding: '10px 16px',
                    borderRadius: 9,
                    border: `1.3px solid ${selected ? INK : available ? ink(0.25) : ink(0.15)}`,
                    background: selected ? INK : available ? '#fff' : 'transparent',
                    color: selected ? YEL : available ? INK : ink(0.35),
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {label}
                </Tap>
              )
            })}
          </div>
        )}
        {inStock.length === 0 && (
          <div
            style={{
              marginTop: 10,
              padding: '12px 14px',
              borderRadius: 10,
              background: ink(0.06),
              fontSize: 12,
              lineHeight: 1.5,
              color: ink(0.7),
            }}
          >
            Этой модели сейчас нет в наличии — шью на заказ по меркам с вашей одежды.
          </div>
        )}

        <div style={{ marginTop: 22, fontSize: 12.5, fontWeight: 700 }}>{t('Ткань')}</div>
        <div style={{ marginTop: 10 }}>
          <FabricSwatches />
        </div>

        <div
          style={{
            marginTop: 22,
            padding: 14,
            borderRadius: 12,
            border: `1px solid ${ink(0.16)}`,
            fontSize: 12,
            lineHeight: 1.55,
            color: ink(0.7),
          }}
        >
          Мерки снимаю только с одежды. Пришлите размеры вашей вещи или приезжайте в с. Шатой —
          детали посадки решим на примерке.
        </div>
      </ScreenBody>

      <ActionBar>
        <Tap
          onClick={buy}
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 11,
            background: canBuy ? INK : ink(0.12),
            color: canBuy ? YEL : ink(0.62),
            textAlign: 'center',
            fontSize: 13.5,
            fontWeight: 700,
          }}
        >
          {buyLabel}
        </Tap>
        <Tap
          onClick={() => navigate('/measure')}
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 11,
            border: `1.4px solid ${INK}`,
            textAlign: 'center',
            fontSize: 13.5,
            fontWeight: 700,
          }}
        >
          {t('Сшить на заказ')}
        </Tap>
      </ActionBar>
    </Screen>
  )
}
