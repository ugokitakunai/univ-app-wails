export function Profile(props: { name: string }) {
  return (
    <div
      style={{
        display: "flex",
        marginBottom: "10px",
        alignItems: "center",
        padding: "10px 5px",
      }}
    >
      <img
        style={{
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          objectFit: "cover",
        }}
        src={"/44.png"}
        alt={"profile picture"}
      />
      <div
        style={{ display: "inline-block", marginLeft: "15px", padding: "0" }}
      >
        <p style={{ margin: 0, padding: "0" }}>{props.name}</p>
        <p style={{ color: "gray", margin: 0, padding: "0" }}>@{"ugk"}</p>
      </div>
      <div style={{ marginLeft: "auto", position: "relative" }}></div>
    </div>
  );
}
