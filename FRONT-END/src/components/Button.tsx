interface Props {
  content: string;
  onclick: () => void;
  theme: string;
  id?: string;
}

function Button({ content, onclick, id, theme }: Props) {
  return (
    <>
      <button
        id={id}
        className={"" + theme}
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
