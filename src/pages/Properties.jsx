import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import styles from './Properties.module.css'

// ダミー物件データ
const DUMMY_PROPERTIES = [
  { id: 1, name: 'グランドヒルズ渋谷', rent: 220000, area: '東京都渋谷区', type: '1LDK', size: 45.2 },
  { id: 2, name: 'パークコート新宿', rent: 185000, area: '東京都新宿区', type: '1K', size: 32.5 },
  { id: 3, name: 'ライオンズマンション横浜', rent: 130000, area: '神奈川県横浜市', type: '2DK', size: 58.0 },
  { id: 4, name: 'プレミスト大阪梅田', rent: 160000, area: '大阪府大阪市北区', type: '1LDK', size: 42.8 },
  { id: 5, name: 'コスモポリス川崎', rent: 98000, area: '神奈川県川崎市', type: '1K', size: 28.0 },
  { id: 6, name: 'ブリリア有明', rent: 280000, area: '東京都江東区', type: '2LDK', size: 72.5 },
]

export default function Properties() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.logo}>不動産管理アプリ</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          ログアウト
        </button>
      </header>

      <main className={styles.main}>
        <h2 className={styles.heading}>物件一覧</h2>
        <p className={styles.count}>{DUMMY_PROPERTIES.length}件の物件</p>

        <div className={styles.grid}>
          {DUMMY_PROPERTIES.map((property) => (
            <div key={property.id} className={styles.card}>
              <div className={styles.cardBadge}>{property.type}</div>
              <h3 className={styles.cardTitle}>{property.name}</h3>
              <p className={styles.cardArea}>
                <span className={styles.icon}>📍</span>
                {property.area}
              </p>
              <p className={styles.cardSize}>{property.size} m²</p>
              <p className={styles.cardRent}>
                ¥{property.rent.toLocaleString()}
                <span className={styles.rentUnit}> / 月</span>
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
