import { MdOutlineFormatBold } from "react-icons/md"

const BoldButton = ({ editor }) => {
  return (
    <button
      type="button"
      onClick={() => editor.chain().focus().toggleBold().run()}
      className={`p-2 rounded ${editor.isActive('bold') ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}
      title="Bold"
    >
     <MdOutlineFormatBold size={25} />
    </button>
  )
}

export default BoldButton