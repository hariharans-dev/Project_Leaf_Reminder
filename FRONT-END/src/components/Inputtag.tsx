interface Props {
  content: (value: string) => void;
  placeholder: string;
  type: string;
  theme: string;
  value?: string;
}

function Inputtag({ content, type, placeholder, theme }: Props) {
  return (
    <>
      <input
        placeholder={placeholder}
        type={type}
        className={"input " + theme}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          content(value);
        }}
      />
    </>
  );
}

export default Inputtag;
