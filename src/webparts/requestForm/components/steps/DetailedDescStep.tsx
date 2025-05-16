import * as React from "react";
import { useState, useEffect } from "react";
import { IRequestFormProps } from "../IRequestFormProps";
import "filepond/dist/filepond.min.css";
import { FilePond, registerPlugin } from "react-filepond";

const DetailedDescStep = (props:any) => {
  const [attachments, setAttachments] = useState<JSX.Element[]>([]);
  const [outPutFormats, setOutPutFormats] = useState([
    { text: "Qlik", checked: false },
    { text: "PDF", checked: false },
    { text: "PowerPoint", checked: false },
    { text: "Excel", checked: false },
    { text: "Word", checked: false },
    { text: "CSV", checked: false },
    { text: "Other", checked: false },
  ]);



  useEffect(() => {
    if (props.values.formMode === "view" && props.values.attachedFiles) {
      const newAttachments = props.values.attachedFiles.map((x:any, i:any) => (
        <div key={i} className="fileDetails">
          <a href={x.ServerRelativeUrl} target="_blank">
            <i className="fa fa-paperclip" aria-hidden="true"></i>
            {x.Name}
          </a>
        </div>
      ));
      setAttachments(newAttachments);
    }
  }, [props.values.attachedFiles, props.values.formMode]);

  useEffect(() => {
    if (props.currentStep === 1 || props.values.formMode === "view") {
      console.log("Loading step2");
      const selectedFormats = props.values.outPutFormat.length
        ? props.values.outPutFormat.split(",")
        : [];
      setOutPutFormats((prevFormats) =>
        prevFormats.map((format) => ({
          ...format,
          checked: selectedFormats.includes(format.text),
        }))
      );
    }
  }, [props.currentStep, props.values.formMode, props.values.outPutFormat]);

  if (props.currentStep === 1 || props.values.formMode === "view") {
    return (
      <div>
        <div className="clearFields mainDiv">
        <details className="SidebarAccordion" open>
        <summary className="check-list-header">Attachments</summary>
        <div className="expand-AccordionContent clearfix">
            
                <div>
                  <label className="form-label w-100">
                    {" "}
                    Please attach any relevant documentation
                  </label>
                </div>
              
                <div>
                  {   props.values.formMode !== "view" && <div
                    className={
                      props.values.formMode !== "view"
                        ? "upload-btn-wrapper"
                        : ""
                    }
                  >
                    <FilePond
                      labelIdle="Attachments: Drag and drop your files or Browse"
                      files={props.values.attachments}
                      allowMultiple={true}
                      onupdatefiles={(fileItems) =>
                        props.UploadFiles(fileItems)
                      }
                    />
                  </div>}
                  { props.values.formMode === "view" && <div
                    className={
                      props.values.formMode === "view"
                        ? "upload-btn-wrapper"
                        : ""
                    }
                  >
                    {attachments}
                  </div>}
                </div>
              
                <div>
                  <label className="notered-paddingLeft15">
                    Note: To be posted to sharepoint a file name can't begin
                    or end with a period, or contain any of these characters:{" "}
                    {'/  < > : * " ? |.'}
                  </label>
                </div>
            
          </div></details>
        </div>
      </div>
    );
  }

  return null;
};

export default DetailedDescStep;
