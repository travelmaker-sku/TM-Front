import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import RegisterAuth from "../../components/auth/RegisterAuth";
import { registerAuth } from "../../lib/api/auth";

const RegisterAuthForm = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const form = e.target as HTMLFormElement;
      const $inputs = Array.from(form.querySelectorAll("input"));

      const [inputVerification] = $inputs.map(($input) => $input.value);
      console.log("Verification:", inputVerification);

      if ([inputVerification].includes("")) {
        console.log("에러 발생");
        setError("빈 칸을 모두 입력하세요.");
        return;
      } else {
        setError(null);
      }

      // API 호출
      registerAuth(inputVerification as string).then((sampleVerification) => {
        if (!sampleVerification) {
          setError("인증번호가 일치하지 않습니다.");
          return;
        } else {
          setError("");
          navigate("/registerFin");
        }
      });
    },
    [navigate]
  );

  const reSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  return <RegisterAuth onSubmit={onSubmit} reSubmit={reSubmit} error={error} />;
};

export default RegisterAuthForm;
