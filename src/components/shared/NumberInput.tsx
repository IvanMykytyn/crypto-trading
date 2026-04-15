import {
  NumberInput as MantineNumberInput,
  type NumberInputProps,
} from "@mantine/core";

type Props = NumberInputProps & {
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder: string;
  label: string;
};
export const NumberInput: React.FC<Props> = ({
  label,
  value,
  onChange,
  placeholder,
  ...rest
}) => {
  return (
    <div className="flex items-center bg-input rounded-sm pt-1 pb-2 pl-3">
      <MantineNumberInput
        {...rest}
        hideControls
        value={value}
        onChange={onChange}
        variant="unstyled"
        placeholder={placeholder}
        styles={{
          input: {
            textAlign: "right",
            height: 36,
            borderRadius: 0,
            borderBottom: "1px solid #0000003D",
            fontSize: 16,
          },
        }}
        className="flex-1"
      />
      <span className="text-currency w-12 font-bold text-xs px-3">{label}</span>
    </div>
  );
};
