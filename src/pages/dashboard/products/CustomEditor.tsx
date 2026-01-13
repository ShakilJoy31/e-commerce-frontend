import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';

ClassicEditor
  .create(document.querySelector('#editor') as HTMLElement, {
    plugins: [
      Essentials,
      Paragraph,
      Heading,
      Bold,
      Italic,
      Link,
      List,
      Alignment
    ],
    toolbar: {
      items: [
        'heading',
        '|',
        'alignment',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'undo',
        'redo'
      ]
    },
    //@ts-ignore
    alignment: {
      options: ['left', 'center', 'right', 'justify']
    }
  })
  .then(editor => {
    console.log('Editor was initialized', editor);
  })
  .catch(error => {
    console.error(error.stack);
  });

export default ClassicEditor;