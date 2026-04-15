import type { ButtonProps } from "@mantine/core";
import { Button as MantineButton } from "@mantine/core";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, ...props }: Props) => {
  return <MantineButton {...props}>{children}</MantineButton>;
};
