import React, { useState, useEffect, useRef, useCallback } from "react";
import * as math from "mathjs";

type Command = {
  command: string;
  purpose: string;
  help?: string[];
  isMain?: boolean;
};

type FieldHistoryEntry = {
  text?: string | string[];
  hasBuffer?: boolean;
  isCommand?: boolean;
  isError?: boolean;
};

type FieldProps = {
  setTheme: (theme: string) => void;
  setTitle: (title: string) => void;
  theme: {
    app: {
      backgroundColor: string;
    };
    field: React.CSSProperties;
    cursor: React.CSSProperties;
  };
};

const Field: React.FC<FieldProps> = (theme) => {
  const fieldRef = useRef<HTMLDivElement | null>(null);

  // State management using hooks
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [commandHistoryIndex, setCommandHistoryIndex] = useState(0);
  const [fieldHistory, setFieldHistory] = useState<FieldHistoryEntry[]>([
    { text: "Portfolio Terminal" },
    { text: "Nhập HELP để xem danh sách lệnh đầy đủ.", hasBuffer: true },
  ]);

  const [userInput, setUserInput] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Recognized commands list
  const recognizedCommands: Command[] = [
    {
      command: "help",
      purpose: "Cung cấp thông tin trợ giúp cho các lệnh Terminal.",
    },
    { command: "date", purpose: "Hiển thị ngày hiện tại." },
    {
      command: "start",
      purpose:
        "Khởi chạy một URL được chỉ định trong một tab mới hoặc cửa sổ riêng biệt.",
      help: [
        "START <URL>",
        "Khởi chạy một URL được chỉ định trong một tab mới hoặc cửa sổ riêng biệt.",
        "",
        "URL......................Trang web bạn muốn mở.",
      ],
    },
    { command: "cls", purpose: "Làm sạch màn hình." },
    {
      command: "cmd",
      purpose: "Bắt đầu một phiên bản mới của Portfolio Terminal.",
    },
    {
      command: "theme",
      purpose: "Thiết lập bảng màu của Portfolio Terminal.",
      help: [
        "THEME <L|LIGHT|D|DARK> [-s, -save]",
        "Sets the color scheme of the React Terminal.",
        "",
        "L, LIGHT.................Sets the color scheme to light mode.",
        "D, DARK..................Sets the color scheme to dark mode.",
        "",
        "-s, -save................Saves the setting to localStorage.",
      ],
    },
    {
      command: "exit",
      purpose:
        "Thoát khỏi Portfolio Terminal và quay lại trang giới thiệu của dcviet",
    },
    { command: "time", purpose: "Hiển thị thời gian hiện tại." },
    {
      command: "about",
      isMain: true,
      purpose: "Hiển thị thông tin cơ bản về dcviet.",
    },
    {
      command: "experience",
      isMain: true,
      purpose: "Hiển thị thông tin về trải nghiệm của dcviet.",
    },
    {
      command: "skills",
      isMain: true,
      purpose:
        "Hiển thị thông tin về kỹ năng của dcviet với tư cách là một nhà phát triển.",
    },
    {
      command: "contact",
      isMain: true,
      purpose: "Hiển thị thông tin liên lạc của dcviet.",
    },
    {
      command: "projects",
      isMain: true,
      purpose:
        "Hiển thị thông tin về các dự án dcviet đã thực hiện trong quá khứ.",
    },
    {
      command: "project",
      isMain: true,
      purpose:
        "Khởi chạy một dự án được chỉ định trong một tab mới hoặc cửa sổ riêng.",
      help: [
        "PROJECT <TITLE>",
        "Khởi chạy một dự án được chỉ định trong một tab mới hoặc cửa sổ riêng.",
        "Danh sách các dự án hiện tại bao gồm:",
        "Minesweeper",
        "PuniUrl",
        "Taggen",
        "Forum",
        "Simon",
        "",
        "TITLE....................Tiêu đề của dự án bạn muốn xem.",
      ],
    },
    {
      command: "title",
      purpose: "Đặt tiêu đề cửa sổ cho Portfolio Terminal.",
      help: [
        "TITLE <INPUT>",
        "Đặt tiêu đề cửa sổ cho Portfolio Terminal.",
        "",
        "INPUT....................Tiêu đề bạn muốn sử dụng cho cửa sổ Portfolio Terminal.",
      ],
    },
    ...["google", "duckduckgo", "bing"].map((cmd) => {
      const properCase =
        cmd === "google"
          ? "Google"
          : cmd === "duckduckgo"
          ? "DuckDuckGo"
          : "Bing";
      return {
        command: cmd,
        purpose: `Tìm kiếm một truy vấn nhất định bằng ${properCase}.`,
        help: [
          `${cmd.toUpperCase()} <QUERY>`,
          `Tìm kiếm một truy vấn nhất định bằng ${properCase}. Nếu không có truy vấn nào được cung cấp, chỉ cần khởi chạy ${properCase}.`,
          "",
          `QUERY....................Tương tự như khi bạn nhập vào thanh tìm kiếm của ${properCase}.`,
        ],
      };
    }),
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkMobile);
    checkMobile(); // Kiểm tra lần đầu khi component mount
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => handleTyping(e);
  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => window.removeEventListener("keydown", handleKeyDown);
  // }, [userInput, commandHistory, commandHistoryIndex]);

  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => handleTyping(e);

  //   window.addEventListener("keydown", handleKeyDown);

  //   return () => window.removeEventListener("keydown", handleKeyDown);
  // }, []);

  // Xử lý đánh giá lệnh đầu vào
  const handleInputEvaluation = (input: string) => {
    try {
      // Kiểm tra nếu là biểu thức toán học
      const evaluatedForArithmetic = math.evaluate(input);
      if (!isNaN(evaluatedForArithmetic)) {
        setFieldHistory((prev) => [
          ...prev,
          { text: evaluatedForArithmetic.toString() },
        ]);
        return;
      }
    } catch (err) {
      // Bỏ qua lỗi toán học, tiếp tục kiểm tra lệnh
    }

    // Xử lý lệnh không phải toán học
    const cleanedInput = input.toLowerCase().trim();
    const dividedInput = cleanedInput.split(" ");
    const parsedCmd = dividedInput[0];
    const parsedParams = dividedInput
      .slice(1)
      .filter((s) => !s.startsWith("-"));
    const parsedFlags = dividedInput.slice(1).filter((s) => s.startsWith("-"));

    // Kiểm tra nếu lệnh không hợp lệ
    const matchedCommand = recognizedCommands.find(
      (s) => s.command === parsedCmd
    );
    if (!matchedCommand) {
      setFieldHistory((prev) => [...prev, giveError("nr", input)]);
      return;
    }

    handleInputExecution(parsedCmd, parsedParams, parsedFlags);
  };

  // Xử lý nhập bàn phím
  // const handleTyping = useCallback(
  //   (e: React.KeyboardEvent<HTMLInputElement>) => {
  //     const { key, ctrlKey, altKey } = e;

  //     const forbiddenKeys = new Set([
  //       ...Array.from({ length: 12 }, (_, y) => `F${y + 1}`),
  //       "ContextMenu",
  //       "Meta",
  //       "NumLock",
  //       "Shift",
  //       "Control",
  //       "Alt",
  //       "CapsLock",
  //       "Tab",
  //       "ScrollLock",
  //       "Pause",
  //       "Insert",
  //       "Home",
  //       "PageUp",
  //       "Delete",
  //       "End",
  //       "PageDown",
  //     ]);

  //     if (forbiddenKeys.has(key) || ctrlKey || altKey) return;

  //     // Xử lý các phím đặc biệt
  //     if (key === "Enter") {
  //       e.preventDefault();
  //       if (userInput.trim()) {
  //         setCommandHistory((prev) => [userInput, ...prev]);
  //         setCommandHistoryIndex(0);
  //         setFieldHistory((prev) => [
  //           ...prev,
  //           { text: userInput, isCommand: true },
  //         ]);
  //         setUserInput("");
  //         handleInputEvaluation(userInput);
  //       } else {
  //         setFieldHistory((prev) => [...prev, { isCommand: true }]);
  //       }
  //     } else if (key === "Backspace") {
  //       e.preventDefault();
  //       setUserInput((prev) => prev.slice(0, -1));
  //     } else if (key.length === 1) {
  //       setUserInput((prev) => prev + key);
  //     }
  //   },
  //   [
  //     userInput,
  //     commandHistory,
  //     setUserInput,
  //     setCommandHistory,
  //     setCommandHistoryIndex,
  //     setFieldHistory,
  //     handleInputEvaluation,
  //   ]
  // );

  // const handleTyping = useCallback(
  //   (e: KeyboardEvent | React.KeyboardEvent<HTMLInputElement>) => {
  //     const key = "key" in e ? e.key : ""; // Xử lý cho cả 2 loại sự kiện
  //     const ctrlKey = "ctrlKey" in e ? e.ctrlKey : false;
  //     const altKey = "altKey" in e ? e.altKey : false;

  //     const forbiddenKeys = new Set([
  //       ...Array.from({ length: 12 }, (_, y) => `F${y + 1}`),
  //       "ContextMenu",
  //       "Meta",
  //       "NumLock",
  //       "Shift",
  //       "Control",
  //       "Alt",
  //       "CapsLock",
  //       "Tab",
  //       "ScrollLock",
  //       "Pause",
  //       "Insert",
  //       "Home",
  //       "PageUp",
  //       "Delete",
  //       "End",
  //       "PageDown",
  //     ]);

  //     if (forbiddenKeys.has(key) || ctrlKey || altKey) return;

  //     e.preventDefault(); // Chặn hành vi mặc định để tránh double chữ

  //     setUserInput((prev) => {
  //       if (key === "Backspace") return prev.slice(0, -1);
  //       if (key === "Escape") return "";
  //       if (key.length === 1) return prev + key;
  //       return prev;
  //     });

  //     if (key === "Enter") {
  //       if (userInput.trim()) {
  //         setCommandHistory((prev) => [userInput, ...prev]);
  //         setCommandHistoryIndex(0);
  //         setFieldHistory((prev) => [
  //           ...prev,
  //           { text: userInput, isCommand: true },
  //         ]);
  //         setUserInput("");
  //         handleInputEvaluation(userInput);
  //       } else {
  //         setFieldHistory((prev) => [...prev, { isCommand: true }]);
  //       }
  //     }
  //   },
  //   [
  //     setUserInput,
  //     setCommandHistory,
  //     setCommandHistoryIndex,
  //     setFieldHistory,
  //     handleInputEvaluation,
  //   ]
  // );

  const handleTyping = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { key, ctrlKey, altKey } = e;
  
    const forbiddenKeys = new Set([
      ...Array.from({ length: 12 }, (_, y) => `F${y + 1}`),
      "ContextMenu",
      "Meta",
      "NumLock",
      "Shift",
      "Control",
      "Alt",
      "CapsLock",
      "Tab",
      "ScrollLock",
      "Pause",
      "Insert",
      "Home",
      "PageUp",
      "Delete",
      "End",
      "PageDown",
    ]);
  
    if (forbiddenKeys.has(key) || ctrlKey || altKey) return;
  
    if (key === "Backspace") {
      setUserInput((prev) => prev.slice(0, -1));
    } else if (key === "Escape") {
      setUserInput("");
    } else if (key === "ArrowUp" || key === "ArrowLeft") {
      setCommandHistoryIndex((prevIndex) => {
        const newIndex = Math.min(prevIndex + 1, commandHistory.length - 1);
        setUserInput(commandHistory[newIndex] || "");
        return newIndex;
      });
    } else if (key === "ArrowDown" || key === "ArrowRight") {
      setCommandHistoryIndex((prevIndex) => {
        const newIndex = Math.max(prevIndex - 1, 0);
        setUserInput(commandHistory[newIndex] || "");
        return newIndex;
      });
    } else if (key === "Enter") {
      if (userInput.trim()) {
        setCommandHistory((prev) => [userInput, ...prev]);
        setCommandHistoryIndex(0);
        setFieldHistory((prev) => [...prev, { text: userInput, isCommand: true }]);
        setUserInput("");
        handleInputEvaluation(userInput);
      } else {
        setFieldHistory((prev) => [...prev, { isCommand: true }]);
      }
    } else {
      setUserInput((prev) => prev + key);
    }
  };
  

  // Xử lý thực thi lệnh đầu vào
  const handleInputExecution = (
    cmd: string,
    params: string[] = [],
    flags: string[] = []
  ) => {
    switch (cmd) {
      case "help":
        if (params.length > 1) {
          setFieldHistory((prev) => [
            ...prev,
            giveError("bp", { cmd: "HELP", noAccepted: 1 }),
          ]);
          return;
        }

        if (params.length === 1) {
          const matchedCommand = recognizedCommands.find(
            (s) => s.command === params[0]
          );
          if (matchedCommand?.help) {
            setFieldHistory((prev) => [
              ...prev,
              { text: matchedCommand.help, hasBuffer: true },
            ]);
          } else {
            setFieldHistory((prev) => [
              ...prev,
              giveError("up", params[0].toUpperCase()),
            ]);
          }
          return;
        }

        setFieldHistory((prev) => [
          ...prev,
          {
            text: [
              "Main commands:",
              ...recognizedCommands
                .filter(({ isMain }) => isMain)
                .map(
                  ({ command, purpose }) =>
                    `${command.toUpperCase()}${".".repeat(
                      15 - command.length
                    )}${purpose}`
                ),
              "",
              "All commands:",
              ...recognizedCommands.map(
                ({ command, purpose }) =>
                  `${command.toUpperCase()}${".".repeat(
                    15 - command.length
                  )}${purpose}`
              ),
              "",
              "For help about a specific command, type HELP <CMD>, e.g. HELP PROJECT.",
            ],
            hasBuffer: true,
          },
        ]);
        return;

      case "cls":
        setFieldHistory([]);
        return;

      case "start":
        if (params.length === 1) {
          const url = params[0];
          const validUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
          setFieldHistory((prev) => [
            ...prev,
            { text: `Launching ${url}...`, hasBuffer: true },
          ]);
          window.open(validUrl, "_blank");
        } else {
          setFieldHistory((prev) => [
            ...prev,
            giveError("bp", { cmd: "START", noAccepted: 1 }),
          ]);
        }
        return;

      case "date":
        setFieldHistory((prev) => [
          ...prev,
          {
            text: `The current date is: ${new Date().toLocaleDateString()}`,
            hasBuffer: true,
          },
        ]);
        return;

      case "exit":
        window.location.href = "https://behance.net/dcviet";
        return;

      default:
        setFieldHistory((prev) => [...prev, giveError("nr", cmd)]);
    }
  };

  // Xử lý dán nội dung từ clipboard
  const handleContextMenuPaste = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard access is not supported.");
      }

      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setUserInput((prev) => prev + clipboardText);
      }
    } catch (error) {
      console.error("Failed to paste from clipboard:", error);
    }
  };

  // Hàm tạo lỗi
  const giveError = (type: string, extra?: any) => {
    const errorMessages: Record<string, string> = {
      nr: `${extra} : The term or expression '${extra}' is not recognized. Check the spelling and try again. If you don't know what commands are recognized, type HELP.`,
      nf: `The ${extra} command requires the use of flags. If you don't know what flags can be used, type HELP ${extra}.`,
      bf: `The flags you provided for ${extra} are not valid. If you don't know what flags can be used, type HELP ${extra}.`,
      bp: `The ${extra?.cmd} command requires ${extra?.noAccepted} parameter(s). If you don't know what parameter(s) to use, type HELP ${extra?.cmd}.`,
      up: `The command ${extra} is not supported by the HELP utility.`,
    };

    return {
      text: errorMessages[type] || "An unknown error occurred.",
      isError: true,
      hasBuffer: true,
    };
  };

  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if (document.activeElement instanceof HTMLInputElement) return; // Không xử lý nếu đang nhập trong input
  //     handleTyping(e as unknown as React.KeyboardEvent<HTMLInputElement>); // Chuyển kiểu dữ liệu
  //   };

  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => window.removeEventListener("keydown", handleKeyDown);
  // }, [handleTyping]);

  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => handleTyping(e);
  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => window.removeEventListener("keydown", handleKeyDown);
  // }, [userInput, commandHistory, commandHistoryIndex]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus(); // Focus vào input khi component render
  }, []);

  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => handleTyping(e);

  //   window.addEventListener("keydown", handleKeyDown);

  //   return () => window.removeEventListener("keydown", handleKeyDown);
  // }, [userInput, commandHistory, commandHistoryIndex]);

  return (
    <div
      id="field"
      onKeyDown={handleTyping}
      tabIndex={0}
      onContextMenu={(e) => handleContextMenuPaste(e)}
      className="code-font"
    >
      {fieldHistory.map(({ text, isCommand, isError, hasBuffer }, index) => {
        if (Array.isArray(text)) {
          return (
            <MultiText
              key={index}
              input={text}
              isError={isError}
              hasBuffer={hasBuffer}
            />
          );
        }

        return (
          <Text
            key={index}
            input={text}
            isCommand={isCommand}
            isError={isError}
            hasBuffer={hasBuffer}
          />
        );
      })}
      <UserText input={userInput} />

      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleTyping}
        style={{
          position: "absolute",
          opacity: 0, // Ẩn input nhưng vẫn nhận sự kiện nhập
          left: "-9999px",
        }}
      />
    </div>
  );
};
export default Field;

const MultiText = ({
  input,
  isError,
  hasBuffer,
}: {
  input: string[];
  isError?: boolean;
  hasBuffer?: boolean;
}) => (
  <div
    className={`multi-text ${isError ? "error" : ""} ${
      hasBuffer ? "buffer" : ""
    }`}
  >
    {input.map((line, index) => (
      <p key={index}>{line}</p>
    ))}
  </div>
);

const Text = ({
  input,
  isCommand,
  isError,
  hasBuffer,
}: {
  input?: string;
  isCommand?: boolean;
  isError?: boolean;
  hasBuffer?: boolean;
}) => (
  <p
    className={`text ${isCommand ? "command" : ""} ${isError ? "error" : ""} ${
      hasBuffer ? "buffer" : ""
    }`}
  >
    {input}
  </p>
);

const UserText = ({ input }: { input: string }) => (
  <p className="user-text">
    <span>RT C:\Users\Guest&gt; </span>
    {input}
  </p>
);
