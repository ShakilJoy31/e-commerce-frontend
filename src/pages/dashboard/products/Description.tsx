import { MyCustomUploadAdapterPlugin } from "./MyCustomImUploadAdapter";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import InputWrapper from "@/components/common/wrapper/InputWrapper";
import { Controller } from "react-hook-form";

const Description = ({ control, errors }) => {
  return (
    <>
      {" "}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <InputWrapper label="In The Box">
          {/* PRODUCT DESCRIPTION */}
          <div className="ckeditor-scroll-container">
            <Controller
              name="inBox"
              control={control}
              render={({ field }) => (
                <CKEditor
                  // @ts-ignore
                  editor={ClassicEditor}
                  data={field.value || ""}
                  config={{
                    toolbar: [
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "link",
                      "bulletedList",
                      "numberedList",
                      "blockQuote",
                      "|",
                      "imageUpload",
                      "undo",
                      "redo",
                      "alignment",
                      "table",
                    ],
                    extraPlugins: [MyCustomUploadAdapterPlugin],
                    heading: {
                      options: [
                        {
                          model: "paragraph",
                          title: "Paragraph",
                          class: "ck-heading_paragraph",
                        },
                        {
                          model: "heading1",
                          view: "h1",
                          title: "Heading 1",
                          class: "ck-heading_heading1",
                        },
                        {
                          model: "heading2",
                          view: "h2",
                          title: "Heading 2",
                          class: "ck-heading_heading2",
                        },
                        {
                          model: "heading3",
                          view: "h3",
                          title: "Heading 3",
                          class: "ck-heading_heading3",
                        },
                        {
                          model: "heading4",
                          view: "h4",
                          title: "Heading 4",
                          class: "ck-heading_heading4",
                        },
                        {
                          model: "heading5",
                          view: "h5",
                          title: "Heading 5",
                          class: "ck-heading_heading5",
                        },
                        {
                          model: "heading6",
                          view: "h6",
                          title: "Heading 6",
                          class: "ck-heading_heading6",
                        },
                      ],
                    },
                  }}
                  onChange={(_, editor) => {
                    field.onChange(editor.getData());
                  }}
                />
              )}
            />
          </div>
          {errors.inBox && (
            <p className="text-red-500">{errors.inBox.message}</p>
          )}
        </InputWrapper>
        <InputWrapper label="Product Short Description">
          {/* PRODUCT DESCRIPTION */}
          <div className="ckeditor-scroll-container">
            <Controller
              name="sortDescription"
              control={control}
              render={({ field }) => (
                <CKEditor
                  // @ts-ignore
                  editor={ClassicEditor}
                  data={field.value || ""}
                  config={{
                    toolbar: [
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "link",
                      "bulletedList",
                      "numberedList",
                      "blockQuote",
                      "|",
                      "imageUpload",
                      "undo",
                      "redo",
                      "alignment",
                    ],
                    extraPlugins: [MyCustomUploadAdapterPlugin],
                    heading: {
                      options: [
                        {
                          model: "paragraph",
                          title: "Paragraph",
                          class: "ck-heading_paragraph",
                        },
                        {
                          model: "heading1",
                          view: "h1",
                          title: "Heading 1",
                          class: "ck-heading_heading1",
                        },
                        {
                          model: "heading2",
                          view: "h2",
                          title: "Heading 2",
                          class: "ck-heading_heading2",
                        },
                        {
                          model: "heading3",
                          view: "h3",
                          title: "Heading 3",
                          class: "ck-heading_heading3",
                        },
                        {
                          model: "heading4",
                          view: "h4",
                          title: "Heading 4",
                          class: "ck-heading_heading4",
                        },
                        {
                          model: "heading5",
                          view: "h5",
                          title: "Heading 5",
                          class: "ck-heading_heading5",
                        },
                        {
                          model: "heading6",
                          view: "h6",
                          title: "Heading 6",
                          class: "ck-heading_heading6",
                        },
                      ],
                    },
                  }}
                  onChange={(_, editor) => {
                    field.onChange(editor.getData());
                  }}
                />
              )}
            />
          </div>
          {errors.sortDescription && (
            <p className="text-red-500">{errors.sortDescription.message}</p>
          )}
        </InputWrapper>
      </div>
      <InputWrapper
        label="Product Specification (1500 × 500 px)"
        className="mt-5"
      >
        {/* PRODUCT DESCRIPTION */}
        <div className="ckeditor-scroll-container">
          <Controller
            name="specification"
            control={control}
            render={({ field }) => (
              <CKEditor
                // @ts-ignore
                editor={ClassicEditor}
                data={field.value || ""}
                config={{
                  alignment: {
                    options: ["left", "center", "right", "justify"],
                  },
                  toolbar: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "link",
                    "bulletedList",
                    "numberedList",
                    "blockQuote",
                    "|",
                    "imageUpload",
                    "imageToolbar",
                    "undo",
                    "redo",
                    "alignment",
                    "table",
                  ],
                  extraPlugins: [MyCustomUploadAdapterPlugin],
                  heading: {
                    options: [
                      {
                        model: "paragraph",
                        title: "Paragraph",
                        class: "ck-heading_paragraph",
                      },
                      {
                        model: "heading1",
                        view: "h1",
                        title: "Heading 1",
                        class: "ck-heading_heading1",
                      },
                      {
                        model: "heading2",
                        view: "h2",
                        title: "Heading 2",
                        class: "ck-heading_heading2",
                      },
                      {
                        model: "heading3",
                        view: "h3",
                        title: "Heading 3",
                        class: "ck-heading_heading3",
                      },
                      {
                        model: "heading4", // Added heading 4
                        view: "h4",
                        title: "Heading 4",
                        class: "ck-heading_heading4",
                      },
                      {
                        model: "heading5", // Added heading 5
                        view: "h5",
                        title: "Heading 5",
                        class: "ck-heading_heading5",
                      },
                      {
                        model: "heading6", // Added heading 6
                        view: "h6",
                        title: "Heading 6",
                        class: "ck-heading_heading6",
                      },
                    ],
                  },
                }}
                onChange={(_, editor) => {
                  field.onChange(editor.getData());
                }}
              />
            )}
          />
        </div>
        {errors.specification && (
          <p className="text-red-500">{errors.specification.message}</p>
        )}
      </InputWrapper>
      <InputWrapper
        label="Product Description (1500 × 500 px)"
        className="mt-5"
      >
        {/* PRODUCT DESCRIPTION */}
        <div className="ckeditor-scroll-container">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <CKEditor
                // @ts-ignore
                editor={ClassicEditor}
                data={field.value || ""}
                config={{
                  alignment: {
                    options: ["left", "center", "right", "justify"],
                  },
                  toolbar: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "link",
                    "bulletedList",
                    "numberedList",
                    "blockQuote",
                    "|",
                    "imageUpload",
                    "imageToolbar",
                    "undo",
                    "redo",
                    "alignment",
                    "table",
                  ],
                  extraPlugins: [MyCustomUploadAdapterPlugin],
                  heading: {
                    options: [
                      {
                        model: "paragraph",
                        title: "Paragraph",
                        class: "ck-heading_paragraph",
                      },
                      {
                        model: "heading1",
                        view: "h1",
                        title: "Heading 1",
                        class: "ck-heading_heading1",
                      },
                      {
                        model: "heading2",
                        view: "h2",
                        title: "Heading 2",
                        class: "ck-heading_heading2",
                      },
                      {
                        model: "heading3",
                        view: "h3",
                        title: "Heading 3",
                        class: "ck-heading_heading3",
                      },
                      {
                        model: "heading4", // Added heading 4
                        view: "h4",
                        title: "Heading 4",
                        class: "ck-heading_heading4",
                      },
                      {
                        model: "heading5", // Added heading 5
                        view: "h5",
                        title: "Heading 5",
                        class: "ck-heading_heading5",
                      },
                      {
                        model: "heading6", // Added heading 6
                        view: "h6",
                        title: "Heading 6",
                        class: "ck-heading_heading6",
                      },
                    ],
                  },
                }}
                onChange={(_, editor) => {
                  field.onChange(editor.getData());
                }}
              />
            )}
          />
        </div>
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </InputWrapper>
    </>
  );
};

export default Description;