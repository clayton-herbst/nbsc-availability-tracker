import React from "react"
import Modal from "react-bootstrap/Modal"


interface ModalForm {
  title: string;
  component: any;
  show: boolean;
  onHide: any;
}

export default (props: ModalForm) => {

  return (
    <Modal
        show={props.show}
        onHide={props.onHide}
      >
        <Modal.Header closeButton={true}>
          <Modal.Title
            className="ml-auto"
            style={{ color: "maroon", paddingLeft: 50 }}
          >
            {props.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.component}
        </Modal.Body>
      </Modal>
  )
}