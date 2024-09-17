import React, { useEffect, useMemo } from 'react'
import { RichTextEditor, Link, RichTextEditorLabels } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import Highlight from '@tiptap/extension-highlight'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Superscript from '@tiptap/extension-superscript'
import SubScript from '@tiptap/extension-subscript'
import Placeholder from '@tiptap/extension-placeholder'
import sanitizeHtml from 'sanitize-html'

const labels: RichTextEditorLabels = {
  // Etiquetas de controles
  linkControlLabel: 'Enlace',
  colorPickerControlLabel: 'Color del texto',
  highlightControlLabel: 'Resaltar texto',
  colorControlLabel: (color) => `Establecer color del texto ${color}`,
  boldControlLabel: 'Negrita',
  italicControlLabel: 'Cursiva',
  underlineControlLabel: 'Subrayado',
  strikeControlLabel: 'Tachado',
  clearFormattingControlLabel: 'Borrar formato',
  unlinkControlLabel: 'Quitar enlace',
  bulletListControlLabel: 'Lista de viñetas',
  orderedListControlLabel: 'Lista ordenada',
  h1ControlLabel: 'Encabezado 1',
  h2ControlLabel: 'Encabezado 2',
  h3ControlLabel: 'Encabezado 3',
  h4ControlLabel: 'Encabezado 4',
  h5ControlLabel: 'Encabezado 5',
  h6ControlLabel: 'Encabezado 6',
  blockquoteControlLabel: 'Bloque de cita',
  alignLeftControlLabel: 'Alinear texto: izquierda',
  alignCenterControlLabel: 'Alinear texto: centro',
  alignRightControlLabel: 'Alinear texto: derecha',
  alignJustifyControlLabel: 'Alinear texto: justificado',
  codeControlLabel: 'Código',
  codeBlockControlLabel: 'Bloque de código',
  subscriptControlLabel: 'Subíndice',
  superscriptControlLabel: 'Superíndice',
  unsetColorControlLabel: 'Quitar color',
  hrControlLabel: 'Línea horizontal',
  undoControlLabel: 'Deshacer',
  redoControlLabel: 'Rehacer',

  // Lista de tareas
  tasksControlLabel: 'Lista de tareas',
  tasksSinkLabel: 'Disminuir nivel de tarea',
  tasksLiftLabel: 'Aumentar nivel de tarea',

  // Editor de enlaces
  linkEditorInputLabel: 'Ingrese la URL',
  linkEditorInputPlaceholder: 'https://ejemplo.com/',
  linkEditorExternalLink: 'Abrir enlace en una nueva pestaña',
  linkEditorInternalLink: 'Abrir enlace en la misma pestaña',
  linkEditorSave: 'Guardar',

  // Control de selector de color
  colorPickerCancel: 'Cancelar',
  colorPickerClear: 'Borrar color',
  colorPickerColorPicker: 'Selector de color',
  colorPickerPalette: 'Paleta de colores',
  colorPickerSave: 'Guardar',
  colorPickerColorLabel: (color) => `Establecer color del texto ${color}`,
}

interface TextEditorProps {
  content?: string
  onChange: (content: string) => void
}

const TextEditor = (props: TextEditorProps) => {
  const sanitizedContent = useMemo(() => sanitizeHtml(props.content ?? ''), [props.content])
  console.log(sanitizedContent)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Escribe aquí tu mensaje' }),
    ],
    content: sanitizedContent,
  })

  useEffect(() => {
    if (editor) {
      editor.on('update', ({ editor }) => {
        props.onChange(editor.getHTML())
      })
    }
  }, [editor])

  return (
    <RichTextEditor editor={editor} labels={labels}>
      <RichTextEditor.Toolbar sticky stickyOffset={60}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  )
}

export default TextEditor
