import React, { useState } from "react";
import { Row, Col, Button, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthHeader from "../../components/AuthHeader";
import NonAuthLayoutWrapper from "../../components/NonAuthLayoutWrapper/NonAuthLayoutWrapper";
import { register } from "../../services/UserServices";
import { setRefreshToken, setAccessToken } from "../../services/TokenService";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const Register = () => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email must be a valid email")
        .required("This a required field"),
      username: Yup.string().required("This a required field"),
      password: Yup.string()
        .required("This a required field")
        .min(6, "Must be 6 characters or more"),
      confirmPassword: Yup.string().required("This a required field"),
    }),
    onSubmit: (values) => {
      handleRegister(values);
    },
  });

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const res = await register(values);
      const { accessToken, refreshToken } = res.data.data;
      setRefreshToken(refreshToken);
      setAccessToken(accessToken);
      toast.success("Register in successfully!");
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
          <div className="pt-md-5 pt-4">
            <AuthHeader
              title="Register Account"
              subtitle="Get your free WeChat account now."
            />
            <Form onSubmit={(e)=> {e.preventDefault(); formik.handleSubmit()}}>
              <Form.Group className="mb-3">
                <Form.Label className="primary-text semi-bold-text big-font-size">
                  Email
                </Form.Label>
                <Form.Control
                  className="auth-text-input normal-font-size"
                  type="email"
                  placeholder="Enter Email"
                  name="email"
                  value={formik.values.email}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div style={{ color: "#c14848" }}>{formik.errors.email}</div>
                ) : null}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="primary-text semi-bold-text big-font-size">
                  Username
                </Form.Label>
                <Form.Control
                  className="auth-text-input normal-font-size"
                  type="text"
                  name="username"
                  placeholder="Enter Username"
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  onChange={formik.handleChange}
                />
                {formik.touched.username && formik.errors.username ? (
                  <div style={{ color: "#c14848" }}>
                    {formik.errors.username}
                  </div>
                ) : null}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="primary-text semi-bold-text big-font-size">
                  Password
                </Form.Label>
                <Form.Control
                  className="auth-text-input normal-font-size"
                  type="password"
                  name="password"
                  placeholder="Enter Password"
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
              <Form.Group className="mb-3">
                <Form.Label className="primary-text semi-bold-text big-font-size">
                  Confirm Password
                </Form.Label>
                <Form.Control
                  className="auth-text-input normal-font-size"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                />
                {formik.touched.confirmPassword &&
                formik.errors.confirmPassword ? (
                  <div style={{ color: "#c14848" }}>
                    {formik.errors.confirmPassword}
                  </div>
                ) : null}
              </Form.Group>
              <p className="primary-text mt-4 normal-font-size">
                By registering you agree to the{" "}
                <span className="theme-text">WeChat Terms of Use</span>
              </p>
              <div className="text-center mt-3">
                <Button
                  className="w-100 primary-button"
                  type="submit"
                  size="lg"
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" variant="white" />
                  ) : (
                    "Register"
                  )}
                </Button>
              </div>
            </Form>
            <div className="mt-5 text-center text-muted">
              <p>
                Don't have an account ?{" "}
                <Link
                  style={{ color: "#4eac6d", fontWeight: 500 }}
                  to="/auth-login"
                  className="fw-medium text-decoration-underline"
                >
                  {" "}
                  Login
                </Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </NonAuthLayoutWrapper>
  );
};

export default Register;
