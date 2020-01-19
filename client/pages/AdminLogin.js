import React from "react"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import { Formik } from "formik"
import { object, string } from "yup"
import Button from "react-bootstrap/Button"
import axios from "axios"

const schema = object({
  username: string()
    .email()
    .required(),
  password: string()
    .required()
    .matches(/^[a-zA-Z0-9]{8,}$/, {
      message: "Minimum of 8 characters is required"
    })
})

console.log(schema)
export default props => {
  return (
    <Container className="my-5 p-5 mx-auto">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values, actions) => {
          axios
            .post("/user/admin/register", {
              email: values.username,
              password: values.password
            })
            .then(response => {
              console.log(response.data)

              if (!response.data.ok) console.log("error")
              else {
                actions.setSubmitting(false)
                console.log("navigate to home")
                props.login()
              }
            })
            .catch(err => console.log(err))

          setTimeout(() => {
            alert(JSON.stringify(values, null, 2))
            actions.setSubmitting(false)
          }, 1000)
        }}
        validationSchema={schema}
      >
        {props => (
          <Form className="w-50 m-auto" onSubmit={props.handleSubmit}>
            <Form.Group>
              <Form.Label className="font-weight-bold">
                Username/Email
              </Form.Label>
              <Form.Control
                type="email"
                size="lg"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                name="username"
                value={props.values.username}
                isInvalid={props.errors.username}
              />
              {props.errors.username && (
                <Form.Control.Feedback type="invalid">
                  {props.errors.username}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label className="font-weight-bold">Password</Form.Label>
              <Form.Control
                size="lg"
                type="password"
                name="password"
                onChange={props.handleChange}
                value={props.values.password}
                isInvalid={props.errors.password}
              />
              {props.errors.password && (
                <Form.Control.Feedback type="invalid">
                  {props.errors.password}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <div className="m-auto p-2 d-flex justify-content-center">
              <Button type="submit">Submit</Button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  )
}
