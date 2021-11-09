import Form from "components/shared/form/Form";
import Input from "components/shared/form/Input";
import InputWrapper from "components/shared/form/InputWrapper";
import Label from "components/shared/form/Label";
import SubmitButton from "components/shared/form/SubmitButton";
import { signupUser } from "lib/firebase";
import { useForm } from "react-hook-form";

export default function Signup() {
  async function onSubmit(event) {
    event.preventDefault();
    const { username, email, password, confirm } = event.target.elements;
    const userCreds = await signupUser({
      email: email.value,
      password: password.value,
    });
    console.log(userCreds);
  }
  return (
    <Form onSubmit={onSubmit}>
      <InputWrapper>
        <Label>username</Label>
        <Input name="username" type="text" />
      </InputWrapper>
      <InputWrapper>
        <Label>email</Label>
        <Input name="email" type="email" />
      </InputWrapper>
      <InputWrapper>
        <Label>password</Label>
        <Input name="password" type="password" />
      </InputWrapper>
      <InputWrapper>
        <Label>confirm password</Label>
        <Input name="confirm password" type="password" />
      </InputWrapper>
      <SubmitButton type="submit">sign up</SubmitButton>
    </Form>
  );
}
