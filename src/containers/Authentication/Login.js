import React, { useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthHeader from "../../components/AuthHeader";
import NonAuthLayoutWrapper from "../../components/NonAuthLayoutWrapper/NonAuthLayoutWrapper";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { setRefreshToken, setAccessToken } from "../../services/TokenService";
import { login } from "../../services/UserServices";
import { useFormik } from "formik";
import * as Yup from "yup";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    email: "",
    password: "",
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email must be a valid email")
        .required("This a required field"),
      password: Yup.string()
        .required("This a required field")
        .min(6, "Must be 6 characters or more"),
    }),
    onSubmit: (values) => {
      handleLogin(values);
    },
  });

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const res = await login(values);
      const { accessToken, refreshToken } = res.data.data;
      setRefreshToken(refreshToken);
      setAccessToken(accessToken);
      toast.success("Logged in successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.msg || err.message || "Something went wrong"
      );
      console.log(err.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <NonAuthLayoutWrapper>
      <Row className=" justify-content-center my-auto">
        <Col sm={8} lg={6} xl={5} className="col-xxl-4">
          <div className="py-md-5 py-4">
            <AuthHeader
              title="Welcome Back !"
              subtitle="Sign in to continue to WeChat."
            />
            <Form onSubmit={(e)=> {e.preventDefault(); formik.handleSubmit()}}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="primary-text semi-bold-text big-font-size">
                  Email
                </Form.Label>
                <Form.Control
                  className="auth-text-input  normal-font-size"
                  type="email"
                  placeholder="Enter Email"
                  name="email"
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div style={{ color: "#c14848" }}>{formik.errors.email}</div>
                ) : null}
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label className="primary-text semi-bold-text big-font-size">
                  Password
                </Form.Label>
                <Form.Control
                  className="auth-text-input normal-font-size"
                  type="password"
                  placeholder="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
                {formik.touched.password && formik.errors.password ? (
                  <div style={{ color: "#c14848" }}>
                    {formik.errors.password}
                  </div>
                ) : null}
              </Form.Group>
              <div className="text-center mt-4">
                <Button
                  className="w-100 primary-button"
                  type="submit"
                  size="lg"
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" variant="white" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
            </Form>
            <div className="mt-5 text-center text-muted">
              <p>
                Don't have an account ?{" "}
                <Link
                  style={{ color: "#4eac6d", fontWeight: 500 }}
                  to="/auth-register"
                  className="fw-medium text-decoration-underline"
                >
                  {" "}
                  Register
                </Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </NonAuthLayoutWrapper>
  );
};

export default Login;
