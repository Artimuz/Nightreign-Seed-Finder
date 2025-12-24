import { pagesWebpUrl } from '@/lib/pagesAssets'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '90px',
        paddingBottom: '70px',
        paddingLeft: '16px',
        paddingRight: '16px',
      }}
    >
      <img
        src={pagesWebpUrl('/Images/404_err.webp')}
        alt="Not Found"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: 'auto',
        }}
        loading="eager"
        decoding="async"
      />
    </div>
  )
}
