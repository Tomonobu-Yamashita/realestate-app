import { useState, useEffect } from 'react'
import styles from './PropertyForm.module.css'

// 間取りの選択肢
const LAYOUT_OPTIONS = ['ワンルーム', '1K', '1DK', '1LDK', '2K', '2DK', '2LDK', '3K', '3DK', '3LDK', '4LDK以上']

// 編集時は initialData にデータが入る。新規登録時は null
export default function PropertyForm({ initialData, onSubmit, onCancel, loading }) {
  const [name, setName] = useState('')
  const [rent, setRent] = useState('')
  const [area, setArea] = useState('')
  const [layout, setLayout] = useState('1LDK')

  // 編集モード時に既存データをフォームにセット
  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setRent(String(initialData.rent))
      setArea(initialData.area)
      setLayout(initialData.layout)
    }
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ name, rent: parseInt(rent, 10), area, layout })
  }

  const isEdit = !!initialData

  return (
    // オーバーレイクリックでキャンセル
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>{isEdit ? '物件を編集' : '物件を登録'}</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name">物件名</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: グランドヒルズ渋谷"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="rent">家賃（円）</label>
            <input
              id="rent"
              type="number"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              placeholder="例: 120000"
              min={1}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="area">エリア名</label>
            <input
              id="area"
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="例: 東京都渋谷区"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="layout">間取り</label>
            <select
              id="layout"
              value={layout}
              onChange={(e) => setLayout(e.target.value)}
            >
              {LAYOUT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onCancel} className={styles.cancelButton}>
              キャンセル
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? '保存中...' : isEdit ? '更新する' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
