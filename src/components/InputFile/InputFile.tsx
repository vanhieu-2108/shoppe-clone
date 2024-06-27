import { Fragment, useRef } from 'react'
import { toast } from 'react-toastify'
const maxSizeUploadAvatar = 1048576

interface Props {
  onchange?: (file?: File) => void
}

export default function InputFile({ onchange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    if (fileFromLocal && (fileFromLocal.size >= maxSizeUploadAvatar || !fileFromLocal.type.includes('image'))) {
      toast.error('Dụng lượng file tối đa 1 MB. Định dạng:.JPEG, .PNG', {
        position: 'top-center'
      })
    } else {
      onchange && onchange(fileFromLocal)
    }
  }
  const handleUpload = () => {
    fileInputRef.current?.click()
  }
  return (
    <Fragment>
      <input
        onChange={onFileChange}
        ref={fileInputRef}
        className='hidden'
        type='file'
        accept='.jpg,.jpeg,.png'
        onClick={(event) => {
          ;(event.target as any).value = null
        }}
      />
      <button
        onClick={handleUpload}
        type='button'
        className='flex items-center justify-end h-10 px-6 text-sm text-gray-600 bg-white border rounded-sm shadow-sm outline-none'
      >
        Chọn Ảnh
      </button>
    </Fragment>
  )
}
