/**
 * Using the Formik and Yup validation libraries.
 * Follow this tutuorial: https://jaredpalmer.com/formik/docs/tutorial#schema-validation-with-yup
 */

import React from "react"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import { useFormik } from "formik"
import { object, string } from "yup"
import Button from "react-bootstrap/Button"
import axios from "axios"

const schema = object({
  username: string()
    .email("Must be a valid email address")
    .required("Field required"),
  password: string()
    .required("Field required")
    .matches(/^[a-zA-Z0-9]{8,}$/, {
      message:
        "Minimum of 8 characters. Characters must be alphabetical or numerical."
    })
})

interface AdminLogin {
  login: any;
}

export default function(props: AdminLogin): any {
  // Use the Formik Libraries useFormik instead of the <Formik> component -- props variable overwritten

  let formik = useFormik({
    initialValues: {
      username: "",
      password: ""
    },
    onSubmit: function(values, actions) {
      axios
        .post("/user/admin/register", {
          email: values.username,
          password: values.password
        })
        .then(function(response: any): any{
          console.log(response.data)

          if (!response.data.ok) console.log("error")
          else {
            actions.setSubmitting(false)
            console.log("navigate to home")
            props.login()
          }
        })
        .catch(err => console.log(err))

      actions.setSubmitting(false)

      setTimeout(() => {
        alert(JSON.stringify(values, null, 2))
      }, 1000)
    },
    validationSchema: schema
  })

  return (
    <Container className="my-5 p-5 mx-auto">
      <Form
        className="w-100 mx-auto"
        onReset={formik.handleReset}
        onSubmit={formik.handleSubmit}
      >
        <Form.Group>
          <Form.Label className="font-weight-bold">Username/Email</Form.Label>
          <Form.Control
            type="email"
            size="lg"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="username"
            value={formik.values.username}
            isInvalid={formik.errors.username === ""}
          />
          {formik.errors.username && (
            <Form.Control.Feedback type="invalid">
              {formik.errors.username}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group>
          <Form.Label className="font-weight-bold">Password</Form.Label>
          <Form.Control
            size="lg"
            type="password"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            isInvalid={formik.errors.password === ""}
          />
          {formik.errors.password && (
            <Form.Control.Feedback type="invalid">
              {formik.errors.password}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <div className="m-auto p-2 w-50 d-flex justify-content-between">
          <Button size="lg" variant="outline-info" type="submit">
            Submit
          </Button>
          <Button
            size="lg"
            as="a"
            href="/"
            type="reset"
            variant="outline-danger"
          >
            Exit
          </Button>
        </div>
      </Form>
    </Container>
  )
}
