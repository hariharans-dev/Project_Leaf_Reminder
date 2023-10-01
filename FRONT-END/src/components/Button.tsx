interface Props {
  content: string;
  onclick: () => void;
  theme: string;
}

function Button({ content, onclick, theme }: Props) {
  return (
    <>
      <button
        className={"btn " + theme}
        onClick={() => {
          onclick();
        }}
      >
        {content}
      </button>
    </>
  );
}

export default Button;
