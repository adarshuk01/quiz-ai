import React, { useState } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function SignUp() {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!form.name) {
      newErrors.name = "Name is required";
    }

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const res = await signup(form);

    if (res.success) {
      navigate("/");
    } else {
      setErrors({ api: res.message });
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-gray-100 items-center justify-center">
        <img
          src="/signup2.png"
          alt="Signup visual"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
        <div className="w-full bg-white rounded-2xl p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Create Account
          </h2>
          <p className="text-gray-500 mb-6">
            Sign up to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Enter your name"
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
            />

            {errors.api && (
              <p className="text-red-500 text-sm">
                {errors.api}
              </p>
            )}

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={loading}
              loading={loading}
            >
              Sign up
            </Button>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
