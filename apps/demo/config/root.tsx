import { DefaultRootProps, RootConfig } from "@/core";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

export type RootProps = DefaultRootProps;

export const Root: RootConfig<{
  props: RootProps;
  fields: {
    userField: { type: "userField"; option: boolean };
  };
}> = {
  defaultProps: {
    title: "Easey AI Page Builder",
  },
  render: ({ puck: { isEditing, renderDropZone: DropZone } }) => {
    return (
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header editMode={isEditing} />
        <DropZone zone="default-zone" style={{ flexGrow: 1 }} />

        <Footer>
          <Footer.List title="Product">
            <Footer.Link href="#">Features</Footer.Link>
            <Footer.Link href="#">AI Components</Footer.Link>
            <Footer.Link href="#">Templates</Footer.Link>
            <Footer.Link href="#">Pricing</Footer.Link>
          </Footer.List>
          <Footer.List title="Resources">
            <Footer.Link href="#">Documentation</Footer.Link>
            <Footer.Link href="#">API Reference</Footer.Link>
            <Footer.Link href="#">Community</Footer.Link>
            <Footer.Link href="#">Support</Footer.Link>
          </Footer.List>
          <Footer.List title="Company">
            <Footer.Link href="#">About</Footer.Link>
            <Footer.Link href="#">Blog</Footer.Link>
            <Footer.Link href="#">Careers</Footer.Link>
            <Footer.Link href="#">Contact</Footer.Link>
          </Footer.List>
          <Footer.List title="Legal">
            <Footer.Link href="#">Privacy</Footer.Link>
            <Footer.Link href="#">Terms</Footer.Link>
            <Footer.Link href="#">Security</Footer.Link>
            <Footer.Link href="#">License</Footer.Link>
          </Footer.List>
        </Footer>
      </div>
    );
  },
};

export default Root;
