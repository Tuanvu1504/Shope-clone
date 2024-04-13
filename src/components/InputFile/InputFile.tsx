import { Fragment, useRef } from 'react'
import Button from '../Button'
import config from 'src/contance/config'
import { toast } from 'react-toastify'

interface Props {
  onChange?: (file?: File) => void
}

export default function InputFile({ onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (
      file &&
      (file.size >= config.maxSizeUploadAvatar || !file?.type.includes('image'))
    ) {
      toast.error(`Dung lượng file tối đa 1 MB. Định dạng:.JPEG, .PNG`, {
        autoClose: 2000
      })
    } else {
      onChange && onChange(file)
    }
  }

  const handleUploadFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <Fragment>
      <input
        type='file'
        onChange={handleFileInputChange}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick={(event) => ((event.target as any).value = null)}
        ref={fileInputRef}
        accept='.jpg, .jpeg, .png'
        className='hidden'
      />
      <Button
        type='button'
        onClick={handleUploadFile}
        className='mt-4 rounded border border-gray-300 px-6 py-2 outline-none focus:border-gray-500 focus:shadow'
      >
        Chọn ảnh
      </Button>
      <div className='w-fit'></div>
    </Fragment>
  )
}
