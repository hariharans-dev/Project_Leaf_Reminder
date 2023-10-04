interface Props {
  content: (value: string) => void;
  placeholder: string;
  type: string;
  theme: string;
  value?: string;
  id?: string;
}

function Inputtag({ content, type, placeholder, id, theme }: Props) {
  return (
    <>
      <input
        id={id}
        placeholder={placeholder}
        type={type}
        className={"" + theme}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          content(value);
        }}
      />
    </>
  );
}

export default Inputtag;
