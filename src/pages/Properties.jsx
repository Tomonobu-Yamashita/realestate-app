import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import PropertyForm from '../components/PropertyForm'
import styles from './Properties.module.css'

export default function Properties() {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')

  // モーダルの表示状態: null=非表示, 'add'=新規, 'edit'=編集
  const [modalMode, setModalMode] = useState(null)
  // 編集対象の物件データ
  const [editingProperty, setEditingProperty] = useState(null)

  // ログインユーザーの物件一覧を取得
  const fetchProperties = useCallback(async () => {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError('物件の取得に失敗しました。')
    } else {
      setProperties(data)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  // 物件を新規登録する
  const handleAdd = async ({ name, rent, area, layout }) => {
    setFormLoading(true)

    // RLSのINSERTポリシーに従いuser_idを付与
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('properties')
      .insert({ name, rent, area, layout, user_id: user.id })

    if (error) {
      setError('登録に失敗しました。')
    } else {
      setModalMode(null)
      await fetchProperties()
    }

    setFormLoading(false)
  }

  // 物件を更新する
  const handleUpdate = async ({ name, rent, area, layout }) => {
    setFormLoading(true)

    const { error } = await supabase
      .from('properties')
      .update({ name, rent, area, layout })
      .eq('id', editingProperty.id)

    if (error) {
      setError('更新に失敗しました。')
    } else {
      setModalMode(null)
      setEditingProperty(null)
      await fetchProperties()
    }

    setFormLoading(false)
  }

  // 物件を削除する
  const handleDelete = async (id) => {
    if (!window.confirm('この物件を削除してよいですか？')) return

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) {
      setError('削除に失敗しました。')
    } else {
      await fetchProperties()
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const openEditModal = (property) => {
    setEditingProperty(property)
    setModalMode('edit')
  }

  const closeModal = () => {
    setModalMode(null)
    setEditingProperty(null)
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
        <div className={styles.toolbar}>
          <div>
            <h2 className={styles.heading}>物件一覧</h2>
            {!loading && (
              <p className={styles.count}>{properties.length}件の物件</p>
            )}
          </div>
          <button
            onClick={() => setModalMode('add')}
            className={styles.addButton}
          >
            ＋ 物件を登録
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {loading ? (
          <p className={styles.loadingText}>読み込み中...</p>
        ) : properties.length === 0 ? (
          <div className={styles.empty}>
            <p>登録されている物件がありません。</p>
            <button onClick={() => setModalMode('add')} className={styles.addButton}>
              ＋ 最初の物件を登録する
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {properties.map((property) => (
              <div key={property.id} className={styles.card}>
                <div className={styles.cardBadge}>{property.layout}</div>
                <h3 className={styles.cardTitle}>{property.name}</h3>
                <p className={styles.cardArea}>
                  <span className={styles.icon}>📍</span>
                  {property.area}
                </p>
                <p className={styles.cardRent}>
                  ¥{property.rent.toLocaleString()}
                  <span className={styles.rentUnit}> / 月</span>
                </p>

                {/* 編集・削除ボタン */}
                <div className={styles.cardActions}>
                  <button
                    onClick={() => openEditModal(property)}
                    className={styles.editButton}
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className={styles.deleteButton}
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 新規登録モーダル */}
      {modalMode === 'add' && (
        <PropertyForm
          initialData={null}
          onSubmit={handleAdd}
          onCancel={closeModal}
          loading={formLoading}
        />
      )}

      {/* 編集モーダル */}
      {modalMode === 'edit' && (
        <PropertyForm
          initialData={editingProperty}
          onSubmit={handleUpdate}
          onCancel={closeModal}
          loading={formLoading}
        />
      )}
    </div>
  )
}
