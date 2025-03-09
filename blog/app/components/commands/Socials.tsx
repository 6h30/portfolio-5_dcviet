import { useContext, useEffect } from "react";
import { ProjectsIntro } from "../styles/Projects.styled";
import { Cmd, CmdDesc, CmdList, HelpWrapper } from "../styles/Help.styled";
import {
  checkRedirect,
  generateTabs,
  getCurrentCmdArry,
  isArgInvalid,
} from "app/lib/funcs";
import { termContext } from "../terminal1";
import Usage from "../usage";
import { Github } from "lucide-react";
import { FaGithub, FaDev } from "react-icons/fa";
import { SiBehance } from "react-icons/si";

const Socials: React.FC = () => {
  const { arg, history, rerender } = useContext(termContext);

  /* ===== get current command ===== */
  const currentCommand = getCurrentCmdArry(history);

  /* ===== check current command makes redirect ===== */
  useEffect(() => {
    if (checkRedirect(rerender, currentCommand, "socials")) {
      socials.forEach(({ id, url }) => {
        id === parseInt(arg[1]) && window.open(url, "_blank");
      });
    }
  }, [arg, rerender, currentCommand]);

  /* ===== check arg is valid ===== */
  const checkArg = () =>
    isArgInvalid(arg, "go", ["1", "2", "3", "4"]) ? (
      <Usage cmd="socials" />
    ) : null;

  return arg.length > 0 || arg.length > 2 ? (
    checkArg()
  ) : (
    <HelpWrapper data-testid="socials">
      <ProjectsIntro>Đây là 1 số kênh mạng xã hội của tôi</ProjectsIntro>
      {socials.map(({ id, title, icon, tab }) => (
        <CmdList key={title}>
          <Cmd>{`${id}. ${title}`}</Cmd>
          {generateTabs(tab)}
          <CmdDesc>
            -
            {typeof icon === "string" ? (
              <img src={icon} alt={title} width="20" height="20" />
            ) : (
              icon
            )}
          </CmdDesc>
        </CmdList>
      ))}
      <Usage cmd="socials" marginY />
    </HelpWrapper>
  );
};

const socials = [
  {
    id: 1,
    title: "GitHub",
    url: "https://github.com/dcviet",
    tab: 3,
    icon: <FaGithub color="black"/>,
  },
  {
    id: 2,
    title: "Dev.to",
    url: "https://dev.to/6h30_dcviet",
    tab: 3,
    icon: <FaDev color="black"/>,
  },
  {
    id: 3,
    title: "Behance",
    url: "https://www.behance.net/dcviet",
    tab: 1,
    icon: <SiBehance color="black"/>,
  },
  {
    id: 4,
    title: "Spiderum",
    url: "https://spiderum.com/nguoi-dung/dcviet",
    tab: 0,
    icon:  "https://spiderum.com/assets/icons/wideLogo.png",
  },
];

export default Socials;
