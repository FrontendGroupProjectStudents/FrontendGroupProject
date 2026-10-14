import { useState, createContext, useContext } from 'react'
const ToastContext = createContext()
export function ToastProvider({ children }) {
const [toastList, setToastList] = useState([])
const showToast = (message, duration = 2000) => {
console.log('🔥 showToast 被呼叫！訊息：', message);
const id = Date.now()
setToastList(prev => [...prev, { id, message }])
console.log('📌 新增toast id:', id);
setTimeout(() => {
setToastList(prev => prev.filter(item => item.id !== id))
    }, duration)
  }
return (
<ToastContext.Provider value={{ showToast }}>
{children}
{/* ✅ 改為畫面頂部居中，避開底部遮擋 */}
<div style={{
position: 'fixed',
top: '24px',
left: '50%',
transform: 'translateX(-50%)',
zIndex: 999999, // 提升到 999999，極高優先級
display: 'flex',
flexDirection: 'column',
gap: '8px',
alignItems: 'center'
      }}>
{toastList.map(item => (
<div
key={item.id}
style={{
padding: '12px 20px',
background: '#222',
color: '#fff',
borderRadius: '8px',
boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
whiteSpace: 'nowrap',
            }}
>
{item.message}
</div>
        ))}
</div>
</ToastContext.Provider>
  )
}
export function useToast() {
return useContext(ToastContext)
}
