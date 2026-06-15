import { defineComponent, ref, computed, onMounted, watch } from "vue";
import LeftSidebar from "./LeftSidebar";
import ChatPanel from "./ChatPanel";
import PromptComposer from "./PromptComposer";
import FeaturesDrawer from "./FeaturesDrawer";
import SystemTelemetryPanel from "./SystemTelemetryPanel";
import CommandPalette from "./CommandPalette";
import PromptLibrary from "./PromptLibrary";
import MissionControl from "./MissionControl";
import FloatingParticles from "./FloatingParticles";
import SplashIntro from "./SplashIntro";
import UserOnboarding from "./UserOnboarding";
import DSAVisualizer from "./DSAVisualizer";
import FileWorkspacePanel from "./FileWorkspacePanel";
import { 
  PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, 
  Terminal, Trash2, FileDown, Command, Sparkles, Menu, Cpu,
  BookOpen, GraduationCap, Code2, Paperclip 
} from "lucide-vue-next";

export default defineComponent({
  name: "PrometheusShell",
  setup() {
    const sessions = ref<any[]>([]);
    const currentSessionId = ref<string>("");
    const input = ref("");
    const loading = ref(false);
    const currentMode = ref("general");
    const isVoiceInputActive = ref(false);
    const isTtsActive = ref(false);
    const isPaletteOpen = ref(false);
    const isLibraryOpen = ref(false);
    const isMissionOpen = ref(false);
    const isFeaturesOpen = ref(false);
    const isDsaOpen = ref(false);
    const isFilePanelOpen = ref(false);
    const uploadedFile = ref<any>(null);
    const theme = ref("dark");

    const isSidebarOpen = ref(true);
    const isTelemetryOpen = ref(true);

    const recognitionRef = ref<any>(null);

    const showIntro = ref(true);
    const showOnboarding = ref(false);
    const isMainUiVisible = ref(false);
    const userName = ref("");
    const voicePref = ref("skip");

    const saveSessions = () => {
      localStorage.setItem("prometheus_vue_sessions", JSON.stringify(sessions.value));
    };

    const getModeLabel = (mode: string) => {
      const modeLabels: Record<string, string> = {
        general: "General",
        dsa: "DSA",
        aiml: "AI/ML",
        fullstack: "Full Stack",
        sql: "SQL",
        linux: "Linux/DevOps",
        placement: "Placement",
      };
      return modeLabels[mode] || mode;
    };

    // Save and load sessions from localStorage
    const loadSessions = () => {
      const saved = localStorage.getItem("prometheus_vue_sessions");
      if (saved) {
        try {
          sessions.value = JSON.parse(saved);
          if (sessions.value.length > 0) {
            currentSessionId.value = sessions.value[0].id;
          }
        } catch (e) {
          console.error(e);
        }
      }
      
      // Initialize default session if empty
      if (sessions.value.length === 0) {
        const defaultSession = {
          id: `session-${Date.now()}`,
          title: "Prometheus Core Sync",
          pinned: false,
          messages: [],
        };
        sessions.value = [defaultSession];
        currentSessionId.value = defaultSession.id;
        saveSessions();
      }
    };

    onMounted(() => {
      loadSessions();
      
      const isMobile = window.innerWidth < 768;
      
      const storedSidebar = localStorage.getItem("prometheus_panel_sidebar_open");
      isSidebarOpen.value = storedSidebar !== null ? storedSidebar === "true" : !isMobile;

      const storedTelemetry = localStorage.getItem("prometheus_panel_telemetry_open");
      isTelemetryOpen.value = storedTelemetry !== null ? storedTelemetry === "true" : !isMobile;

      isMissionOpen.value = localStorage.getItem("prometheus_panel_mission_open") === "true";
      isLibraryOpen.value = localStorage.getItem("prometheus_panel_library_open") === "true";
      isDsaOpen.value = localStorage.getItem("prometheus_panel_dsa_open") === "true";
      isFilePanelOpen.value = localStorage.getItem("prometheus_panel_file_open") === "true";

      const storedName = localStorage.getItem("prometheus_user_name");
      if (storedName) {
        userName.value = storedName;
      }

      const storedVoice = localStorage.getItem("prometheus_voice_pref");
      if (storedVoice) {
        voicePref.value = storedVoice;
      }
      
      // Read theme
      const savedTheme = localStorage.getItem("prometheus_vue_theme");
      if (savedTheme) {
        theme.value = savedTheme;
        if (savedTheme === "light") {
          document.documentElement.classList.add("saas-light-mode");
        }
      }
    });

    const handleIntroStartTransition = () => {
      const storedName = localStorage.getItem("prometheus_user_name");
      if (storedName) {
        isMainUiVisible.value = true;
      }
    };

    const handleIntroComplete = () => {
      showIntro.value = false;
      const storedName = localStorage.getItem("prometheus_user_name");
      if (!storedName) {
        showOnboarding.value = true;
      }
    };

    const handleOnboardingComplete = (name: string, voicePrefValue: string) => {
      userName.value = name;
      localStorage.setItem("prometheus_user_name", name);
      voicePref.value = voicePrefValue;
      localStorage.setItem("prometheus_voice_pref", voicePrefValue);

      // Add welcoming message if session has no messages yet
      const activeSess = currentSession.value;
      if (activeSess && activeSess.messages.length === 0) {
        activeSess.messages.push({
          role: "assistant",
          content: `Hi ${name} 👋 Welcome to Prometheus AI. I’m ready to help you today.`
        });
        saveSessions();
      }

      // Smooth transition to main UI
      isMainUiVisible.value = true;
      setTimeout(() => {
        showOnboarding.value = false;
      }, 500);
    };

    const handleChangeVoicePref = (pref: string) => {
      voicePref.value = pref;
      localStorage.setItem("prometheus_voice_pref", pref);
    };

    const currentSession = computed(() => {
      return sessions.value.find((s) => s.id === currentSessionId.value) || null;
    });

    const messages = computed(() => {
      return currentSession.value ? currentSession.value.messages : [];
    });

    // Session modification handlers
    const handleSelectSession = (id: string) => {
      currentSessionId.value = id;
    };

    const handleNewSession = () => {
      const newSess = {
        id: `session-${Date.now()}`,
        title: `Core Sync ${sessions.value.length + 1}`,
        pinned: false,
        messages: [],
      };
      sessions.value = [newSess, ...sessions.value];
      currentSessionId.value = newSess.id;
      saveSessions();
    };

    const handleDeleteSession = (id: string) => {
      if (sessions.value.length === 1) {
        alert("Cannot delete the only remaining session node.");
        return;
      }
      if (confirm("Execute command memory flush? All messages in this session will be deleted.")) {
        sessions.value = sessions.value.filter((s) => s.id !== id);
        if (currentSessionId.value === id) {
          currentSessionId.value = sessions.value[0].id;
        }
        saveSessions();
      }
    };

    const handleRenameSession = (id: string, newTitle: string) => {
      const sess = sessions.value.find((s) => s.id === id);
      if (sess) {
        sess.title = newTitle;
        saveSessions();
      }
    };

    const handleTogglePinSession = (id: string) => {
      const sess = sessions.value.find((s) => s.id === id);
      if (sess) {
        sess.pinned = !sess.pinned;
        saveSessions();
      }
    };

    const handleToggleTheme = () => {
      if (theme.value === "dark") {
        theme.value = "light";
        document.documentElement.classList.add("saas-light-mode");
      } else {
        theme.value = "dark";
        document.documentElement.classList.remove("saas-light-mode");
      }
      localStorage.setItem("prometheus_vue_theme", theme.value);
    };

    // --- STREAMING FETCH ---
    const handleSend = async (customPrompt?: string) => {
      const promptToSend = customPrompt || input.value;
      if (!promptToSend.trim() && !uploadedFile.value && !loading.value) return;
      if (loading.value) return;

      const activeSess = currentSession.value;
      if (!activeSess) return;

      let userMsgContent = promptToSend;
      let payloadPrompt = promptToSend;
      let fileBase64 = null;
      let fileType = null;

      // If there is an uploaded file pending, we attach its contents to the prompt payload
      if (uploadedFile.value) {
        fileBase64 = uploadedFile.value.base64;
        fileType = uploadedFile.value.type;
        
        if (!fileBase64) {
          payloadPrompt = `${promptToSend}\n\nFile Contents (${uploadedFile.value.name}):\n\`\`\`\n${uploadedFile.value.text}\n\`\`\``;
        }
        
        userMsgContent = promptToSend ? `${promptToSend} (Attached: ${uploadedFile.value.name})` : `Analyzing: ${uploadedFile.value.name}`;
      }

      const userMsg = { 
        role: "user", 
        content: userMsgContent,
        file: uploadedFile.value ? {
          name: uploadedFile.value.name,
          size: uploadedFile.value.size,
          type: uploadedFile.value.type
        } : undefined
      };
      
      activeSess.messages.push(userMsg);
      saveSessions();
      input.value = "";
      loading.value = true;

      // Clear active attachment
      uploadedFile.value = null;

      try {
        const messagesToSend = activeSess.messages.slice(0, -1);
        messagesToSend.push({
          role: "user",
          content: payloadPrompt,
          base64: fileBase64,
          fileType: fileType
        });

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: messagesToSend,
            mode: currentMode.value,
          }),
        });

        if (!res.ok) throw new Error("Sync failure");

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) throw new Error("No reader initialized");

        activeSess.messages.push({ role: "assistant", content: "" });
        const assistantMsgIndex = activeSess.messages.length - 1;

        let accumulatedContent = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("0:")) {
              try {
                const text = JSON.parse(line.substring(2));
                accumulatedContent += text;
              } catch (e) {}
            }
          }

          activeSess.messages[assistantMsgIndex] = {
            ...activeSess.messages[assistantMsgIndex],
            content: accumulatedContent
          };
          activeSess.messages = [...activeSess.messages];
          saveSessions();
        }

        if (buffer && buffer.startsWith("0:")) {
          try {
            const text = JSON.parse(buffer.substring(2));
            accumulatedContent += text;
            activeSess.messages[assistantMsgIndex] = {
              ...activeSess.messages[assistantMsgIndex],
              content: accumulatedContent
            };
            activeSess.messages = [...activeSess.messages];
            saveSessions();
          } catch (e) {}
        }

        if (isTtsActive.value && typeof window !== "undefined" && "speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(accumulatedContent);
          utterance.lang = /[\u0c00-\u0c7f]/.test(accumulatedContent) ? "te-IN" : "en-US";
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utterance);
        }

      } catch (err) {
        console.error(err);
        activeSess.messages.push({
          role: "assistant",
          content: "Sync Error. System integrity offline.",
        });
        saveSessions();
      } finally {
        loading.value = false;
      }
    };

    // --- FILE UPLOAD AUTO-SEND FLOW ---
    const handleFileUploaded = (fileData: any) => {
      const activeSess = currentSession.value;
      if (!activeSess) return;

      // 1. Add User message with the file metadata
      const userMsg = {
        role: "user",
        content: `Uploaded file: ${fileData.name}`,
        file: {
          name: fileData.name,
          size: fileData.size,
          type: fileData.type
        }
      };
      activeSess.messages.push(userMsg);

      // Store file contents in temporary state
      uploadedFile.value = {
        name: fileData.name,
        size: fileData.size,
        type: fileData.type,
        text: fileData.text,
        base64: fileData.base64
      };
      
      // Open the File Workspace panel for preview and actions
      isFilePanelOpen.value = true;

      // 2. Build local AI message response content based on status
      let responseText = "";
      if (fileData.unreadable) {
        responseText = "This file format is not directly readable here, but you can still ask me about it. Try uploading a text/PDF/CSV version or paste the content.";
      } else {
        if (fileData.isTruncated) {
          responseText += "This file is large. I’ll analyze the first readable part first. You can ask for specific sections.\n\n";
        }
        responseText += "I extracted what I could from this file. What do you want me to do with it?";
      }

      const assistantMsg = {
        role: "assistant",
        content: responseText,
        filePrompt: !fileData.unreadable, // Only show action buttons if readable
        file: {
          name: fileData.name,
          type: fileData.type
        }
      };
      activeSess.messages.push(assistantMsg);

      saveSessions();
    };

    // --- INTERACTIVE FILE ACTIONS OPTION SELECTOR ---
    const handleSelectFileOption = async (optionId: string, fileInfo: any) => {
      const activeSess = currentSession.value;
      if (!activeSess) return;

      const optionLabels: Record<string, string> = {
        summary: "Summary",
        indepth: "In-depth explanation",
        shorter: "Shorter summary",
        telish: "Telugu-English translation",
        notes: "Study notes",
        interview: "Interview Q&A list",
        key_points: "Key points extraction",
        debug: "Debug code analysis",
        analyze: "Dataset analysis",
        extract_info: "Extract important information",
        beginner: "Beginner explanation",
      };

      const label = optionLabels[optionId] || optionId;
      
      const userMsg = {
        role: "user",
        content: `Process file "${fileInfo.name}" with action: ${label}`,
      };
      activeSess.messages.push(userMsg);
      saveSessions();

      let fileText = "";
      let fileBase64 = null;
      if (uploadedFile.value && uploadedFile.value.name === fileInfo.name) {
        fileText = uploadedFile.value.text;
        fileBase64 = uploadedFile.value.base64;
      }

      const prompts: Record<string, string> = {
        summary: `Please summarize the contents of the uploaded file "${fileInfo.name}" clearly.`,
        indepth: `Give a comprehensive, in-depth explanation of the contents of the uploaded file "${fileInfo.name}".`,
        shorter: `Provide a very short, concise explanation of the uploaded file "${fileInfo.name}".`,
        telish: `Explain the contents of the uploaded file "${fileInfo.name}" in conversational Telugu-English.`,
        notes: `Generate structured study notes and quick cheat sheet parameters from the uploaded file "${fileInfo.name}".`,
        interview: `Convert the contents of the uploaded file "${fileInfo.name}" into mock technical interview questions and answers.`,
        key_points: `Extract and list the key points and critical highlights from the uploaded file "${fileInfo.name}".`,
        debug: `Audit code inside the uploaded file "${fileInfo.name}". Find potential bugs, errors, edge cases, and provide a corrected version.`,
        analyze: `Perform data analysis on the contents of the uploaded file "${fileInfo.name}". Extract trends, anomalies, and insights.`,
        extract_info: `Extract all important information, metadata, structural schemas, or tables from the uploaded file "${fileInfo.name}".`,
        beginner: `Explain the contents of the uploaded file "${fileInfo.name}" in extremely simple terms, like I am a beginner.`,
      };

      const promptText = prompts[optionId] || `Process the file "${fileInfo.name}"`;
      const fullPrompt = `${promptText}\n\nFile Contents:\n\`\`\`\n${fileText}\n\`\`\``;

      loading.value = true;
      uploadedFile.value = null; // Reset

      try {
        const messagesToSend = activeSess.messages.slice(0, -1);
        messagesToSend.push({
          role: "user",
          content: fullPrompt,
          base64: fileBase64,
          fileType: fileInfo.type
        });

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: messagesToSend,
            mode: currentMode.value,
          }),
        });

        if (!res.ok) throw new Error("Sync failure");

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) throw new Error("No reader initialized");

        activeSess.messages.push({ role: "assistant", content: "" });
        const assistantMsgIndex = activeSess.messages.length - 1;

        let accumulatedContent = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("0:")) {
              try {
                const text = JSON.parse(line.substring(2));
                accumulatedContent += text;
              } catch (e) {}
            }
          }

          activeSess.messages[assistantMsgIndex] = {
            ...activeSess.messages[assistantMsgIndex],
            content: accumulatedContent
          };
          activeSess.messages = [...activeSess.messages];
          saveSessions();
        }

        if (buffer && buffer.startsWith("0:")) {
          try {
            const text = JSON.parse(buffer.substring(2));
            accumulatedContent += text;
            activeSess.messages[assistantMsgIndex] = {
              ...activeSess.messages[assistantMsgIndex],
              content: accumulatedContent
            };
            activeSess.messages = [...activeSess.messages];
            saveSessions();
          } catch (e) {}
        }

        if (isTtsActive.value && typeof window !== "undefined" && "speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(accumulatedContent);
          utterance.lang = /[\u0c00-\u0c7f]/.test(accumulatedContent) ? "te-IN" : "en-US";
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utterance);
        }

      } catch (err) {
        console.error(err);
        activeSess.messages.push({
          role: "assistant",
          content: "Sync Error. System integrity offline.",
        });
        saveSessions();
      } finally {
        loading.value = false;
      }
    };

    // --- FEATURES DRAWER OPTIONS SELECTION ---
    const handleSelectFeature = (featureId: string) => {
      const activeSess = currentSession.value;
      const lastMsg = activeSess && activeSess.messages.length > 0
        ? activeSess.messages[activeSess.messages.length - 1]
        : null;

      const followUpPrompts: Record<string, string> = {
        simplify: "Simplify and summarize the previous explanation.",
        telish: "Explain the previous response in simple, conversational Telugu-English.",
        stepbystep: "Explain the previous response step-by-step with clear reasoning.",
        example: "Provide practical, real-world examples for the previous explanation.",
        deeper: "Deep dive into the core logic, mathematics, and edge cases of the previous explanation.",
        shorter: "Make the previous response shorter and more concise.",
        followup: "Ask me follow-up questions to test my understanding of the previous explanation.",
        interview_qa: "Convert the previous topic/content into interview questions and answers.",
        mock_questions: "Simulate a mock technical interview based on the previous topic.",
        hr_answer: "How should I frame the previous response as a job interview answer?",
        resume_points: "Turn the previous response into structured resume bullet points with action verbs.",
        debug: "Find potential bugs, errors, edge cases, and debug the code in the previous response.",
        optimize: "Optimize the code in the previous response for speed or memory complexity.",
        dryrun: "Trace variables and perform a step-by-step dry run on the code in the previous response.",
        complexity: "Analyze the Time and Space complexity of the code in the previous response.",
        convert_lang: "Convert the code in the previous response to another programming language.",
        summary: "Summarize the core concepts of the previous explanation.",
        key_points: "Highlight the key points and critical takeaways of the previous explanation.",
        notes: "Generate structured study notes and guidelines from the previous explanation.",
        extract_info: "Extract all critical data, schemas, tables, or key metadata from the previous explanation.",
        analyze_data: "Analyze the dataset, patterns, and features inside the previous explanation.",
      };

      const filePrompts: Record<string, string> = {
        summary: "Please summarize the contents of the uploaded file clearly.",
        indepth: "Give a comprehensive, in-depth explanation of the contents of the uploaded file.",
        shorter: "Provide a very short, concise explanation of the uploaded file.",
        telish: "Explain the contents of the uploaded file in conversational Telugu-English.",
        notes: "Generate structured study notes and quick cheat sheet parameters from the uploaded file.",
        interview: "Convert this file's contents into mock technical interview questions and answers.",
        key_points: "Extract and list the key points and critical highlights from this file.",
        debug: "Audit code inside this file. Find potential bugs, errors, edge cases, and provide a corrected version.",
        analyze: "Perform data analysis on this file. Extract trends, anomalies, and insights.",
        beginner: "Explain the contents of this file in extremely simple terms, like I am a beginner.",
        extract_info: "Extract all critical metadata, schemas, or key information from this file.",
        mock_questions: "Simulate a mock technical interview drill based on the file contents.",
        hr_answer: "Frame a job interview answer based on this file.",
        resume_points: "Generate resume points for this file.",
        optimize: "Optimize code inside this file.",
        dryrun: "Perform a dry run of code in this file.",
        complexity: "Analyze the complexity of code in this file.",
        convert_lang: "Convert code in this file.",
        stepbystep: "Explain this file step-by-step.",
        example: "Explain this file with practical examples.",
        followup: "Ask follow-up questions for this file.",
        simplify: "Simplify and explain the content of this file.",
      };

      const emptyStatePrompts: Record<string, string> = {
        simplify: "Simplify the following concept: ",
        telish: "Explain this in Telugu-English clearly with simple examples: ",
        stepbystep: "Explain this step-by-step: ",
        example: "Provide a practical, real-world execution example for: ",
        deeper: "Explain this in-depth with intuition, examples, edge cases, and real-world usage: ",
        shorter: "Make this explanation shorter and concise: ",
        followup: "Ask me follow-up questions to test my understanding of: ",
        interview_qa: "Convert this topic into interview questions and answers: ",
        mock_questions: "Simulate a mock technical interview drill for: ",
        hr_answer: "Frame this response as a job interview answer: ",
        resume_points: "Generate resume bullet points for: ",
        debug: "Find potential bugs, edge cases, and debug the following code:\n",
        optimize: "Optimize the following code for speed or memory usage:\n",
        dryrun: "Provide a step-by-step dry run representation for the following code:\n",
        complexity: "Calculate the Time and Space complexity of the following code:\n",
        convert_lang: "Convert the following code to another language:\n",
        summary: "Summarize the following content: ",
        key_points: "Extract key points from: ",
        notes: "Generate study notes for: ",
        extract_info: "Extract key information from: ",
        analyze_data: "Analyze the following dataset or CSV: ",
      };

      // Case 1: User has typed input in the text input box
      if (input.value.trim() !== "") {
        const typedText = input.value.trim();
        let combinedPrompt = "";

        if (featureId === "simplify") combinedPrompt = `Simplify and explain: ${typedText}`;
        else if (featureId === "telish") combinedPrompt = `Explain ${typedText} in simple, conversational Telugu-English.`;
        else if (featureId === "stepbystep") combinedPrompt = `Provide a step-by-step explanation of: ${typedText}`;
        else if (featureId === "example") combinedPrompt = `Explain ${typedText} with practical, real-world examples.`;
        else if (featureId === "deeper") combinedPrompt = `Deep dive into: ${typedText} (intuition, math, proofs, and edge cases)`;
        else if (featureId === "shorter") combinedPrompt = `Explain ${typedText} in a very short, concise manner.`;
        else if (featureId === "followup") combinedPrompt = `Ask me follow-up questions about: ${typedText}`;
        else if (featureId === "interview_qa") combinedPrompt = `Generate interview questions and answers about: ${typedText}`;
        else if (featureId === "mock_questions") combinedPrompt = `Simulate a mock technical interview about: ${typedText}`;
        else if (featureId === "hr_answer") combinedPrompt = `Frame a job interview answer for: ${typedText}`;
        else if (featureId === "resume_points") combinedPrompt = `Generate resume bullet points for: ${typedText}`;
        else if (featureId === "debug") combinedPrompt = `Find bugs and optimize the following code: ${typedText}`;
        else if (featureId === "optimize") combinedPrompt = `Optimize the following code: ${typedText}`;
        else if (featureId === "dryrun") combinedPrompt = `Perform a dry run of the following code: ${typedText}`;
        else if (featureId === "complexity") combinedPrompt = `Analyze the complexity of the following code: ${typedText}`;
        else if (featureId === "convert_lang") combinedPrompt = `Convert the following code to another language: ${typedText}`;
        else if (featureId === "summary") combinedPrompt = `Summarize the following text: ${typedText}`;
        else if (featureId === "key_points") combinedPrompt = `Extract key highlights from: ${typedText}`;
        else if (featureId === "notes") combinedPrompt = `Generate study notes for: ${typedText}`;
        else if (featureId === "extract_info") combinedPrompt = `Extract schema or metadata from: ${typedText}`;
        else if (featureId === "analyze_data") combinedPrompt = `Analyze the data parameters of: ${typedText}`;
        else combinedPrompt = `${typedText} (${featureId})`;

        handleSend(combinedPrompt);
        return;
      }

      // Case 2: Uploaded file content is active
      if (uploadedFile.value) {
        const actionPrompt = filePrompts[featureId] || `Process the file with feature: ${featureId}`;
        const fullPrompt = `${actionPrompt}\n\nFile Contents:\n\`\`\`\n${uploadedFile.value.text}\n\`\`\``;
        
        const userMsg = {
          role: "user",
          content: `Analyze file "${uploadedFile.value.name}" with action: ${featureId}`,
          file: {
            name: uploadedFile.value.name,
            size: uploadedFile.value.size,
            type: uploadedFile.value.type
          }
        };
        activeSess.messages.push(userMsg);
        saveSessions();

        const tempFile = uploadedFile.value;
        uploadedFile.value = null; // Clear

        loading.value = true;
        (async () => {
          try {
            const res = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                messages: [
                  ...activeSess.messages.slice(0, -1),
                  {
                    role: "user",
                    content: fullPrompt,
                    base64: tempFile.base64,
                    fileType: tempFile.type
                  }
                ],
                mode: currentMode.value,
              }),
            });

            if (!res.ok) throw new Error("Sync failure");

            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) throw new Error("No reader initialized");

            activeSess.messages.push({ role: "assistant", content: "" });
            const assistantMsgIndex = activeSess.messages.length - 1;

            let accumulatedContent = "";
            let buffer = "";

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";

              for (const line of lines) {
                if (line.startsWith("0:")) {
                  try {
                    const text = JSON.parse(line.substring(2));
                    accumulatedContent += text;
                  } catch (e) {}
                }
              }

              activeSess.messages[assistantMsgIndex] = {
                ...activeSess.messages[assistantMsgIndex],
                content: accumulatedContent
              };
              activeSess.messages = [...activeSess.messages];
              saveSessions();
            }
          } catch (err) {
            console.error(err);
          } finally {
            loading.value = false;
          }
        })();
        return;
      }

      // Case 3: Existing AI response
      if (lastMsg && lastMsg.role === "assistant") {
        const followUp = followUpPrompts[featureId];
        if (followUp) {
          handleSend(followUp);
          return;
        }
      }

      // Case 4: Nothing exists
      const placeholder = emptyStatePrompts[featureId];
      if (placeholder) {
        input.value = placeholder;
        setTimeout(() => {
          const el = document.querySelector("textarea");
          if (el) {
            el.focus();
            (el as any).selectionStart = (el as any).selectionEnd = placeholder.length;
          }
        }, 50);
      }
    };

    // --- STT voice input ---
    const toggleSpeechToText = () => {
      if (typeof window === "undefined") return;

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert("Speech Recognition API is not supported in this browser.");
        return;
      }

      if (isVoiceInputActive.value) {
        recognitionRef.value?.stop();
        isVoiceInputActive.value = false;
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onstart = () => {
        isVoiceInputActive.value = true;
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        input.value += (input.value ? " " : "") + transcript;
      };

      recognition.onend = () => {
        isVoiceInputActive.value = false;
      };

      recognitionRef.value = recognition;
      recognition.start();
    };

    // --- EXPORT TRANSCRIPT ---
    const exportSession = () => {
      const activeSess = currentSession.value;
      if (!activeSess || activeSess.messages.length === 0) {
        return alert("Transcript log is empty.");
      }

      let content = `# PROMETHEUS OS - SESSION TRANSCRIPT\n`;
      content += `Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
      content += `Developer: Prometheus Core Team\n`;
      content += `Owner: ${userName.value || "Commander"}\n`;
      content += `Origin: Local sovereign workspace\n`;
      content += `=========================================================\n\n`;

      activeSess.messages.forEach((m: any) => {
        content += `### [${m.role === "user" ? "USER" : "PROMETHEUS OS"}]\n\n${m.content}\n\n`;
        content += `---------------------------------------------------------\n\n`;
      });

      const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `prometheus_session_${new Date().toISOString().slice(0, 10)}.md`;
      link.click();
      URL.revokeObjectURL(url);
    };

    // --- CLEAR LOGS ---
    const clearSession = () => {
      const activeSess = currentSession.value;
      if (!activeSess) return;

      if (confirm("Execute command memory flush? All session variables will be deleted.")) {
        activeSess.messages = [];
        saveSessions();
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      }
    };

    const handleSelectPrompt = (promptText: string) => {
      input.value = promptText;
      handleSend(promptText);
    };

    const handleCodeAction = (action: string, code: string) => {
      let promptText = "";
      if (action === "Explain") {
        promptText = `Explain the following code snippet step-by-step:\n\`\`\`\n${code}\n\`\`\``;
      } else if (action === "Debug") {
        promptText = `Find potential bugs, edge cases, and debug the following code:\n\`\`\`\n${code}\n\`\`\``;
      } else if (action === "Dry Run") {
        promptText = `Perform a dry run on this code with sample input values:\n\`\`\`\n${code}\n\`\`\``;
      } else if (action === "Complexity") {
        promptText = `Calculate the Time and Space complexity of the following code:\n\`\`\`\n${code}\n\`\`\``;
      } else if (action === "Optimize") {
        promptText = `Optimize the following code for speed or memory usage:\n\`\`\`\n${code}\n\`\`\``;
      }

      handleSelectPrompt(promptText);
    };

    const handlePaletteCommand = (cmdId: string) => {
      if (cmdId === "clear") {
        clearSession();
      } else if (cmdId === "export") {
        exportSession();
      } else if (cmdId === "voice") {
        toggleSpeechToText();
      } else if (cmdId === "tts") {
        isTtsActive.value = !isTtsActive.value;
      } else if (cmdId === "library") {
        isLibraryOpen.value = true;
      } else if (cmdId === "mission") {
        isMissionOpen.value = true;
      } else if (cmdId === "dsa_visualizer") {
        isDsaOpen.value = true;
      } else if (cmdId === "file_workspace") {
        isFilePanelOpen.value = true;
      } else if (cmdId.startsWith("mode_")) {
        currentMode.value = cmdId.replace("mode_", "");
      } else if (cmdId === "theme") {
        handleToggleTheme();
      }
    };

    // Watchers to persist panel states
    watch(isSidebarOpen, (val) => localStorage.setItem("prometheus_panel_sidebar_open", String(val)));
    watch(isTelemetryOpen, (val) => localStorage.setItem("prometheus_panel_telemetry_open", String(val)));
    watch(isMissionOpen, (val) => localStorage.setItem("prometheus_panel_mission_open", String(val)));
    watch(isLibraryOpen, (val) => localStorage.setItem("prometheus_panel_library_open", String(val)));
    watch(isDsaOpen, (val) => localStorage.setItem("prometheus_panel_dsa_open", String(val)));
    watch(isFilePanelOpen, (val) => localStorage.setItem("prometheus_panel_file_open", String(val)));

    return () => (
      <div className="fixed inset-0 text-zinc-100 flex flex-col overflow-hidden select-none">
        
        {/* Grids and overlays */}
        <div className="cinematic-grid" />
        <div className="scan-line-overlay" />
        <FloatingParticles />

        {/* Left Sidebar backdrop for mobile/drawer closing */}
        {isSidebarOpen.value && (
          <div
            onClick={() => (isSidebarOpen.value = false)}
            className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity duration-300"
          />
        )}

        {/* Right Telemetry backdrop for mobile/drawer closing */}
        {isTelemetryOpen.value && (
          <div
            onClick={() => (isTelemetryOpen.value = false)}
            className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity duration-300"
          />
        )}

        {/* HUD Top Bar Header */}
        <header className={`shrink-0 h-20 flex justify-between items-center px-4 md:px-8 border-b border-white/5 bg-black/40 z-50 select-none transition-all duration-[800ms] ease-out ${
          isMainUiVisible.value 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 -translate-y-6 pointer-events-none"
        }`}>
          <div className="flex items-center gap-2 md:gap-3.5">
            {/* Hamburger button on mobile */}
            <button
              onClick={() => (isSidebarOpen.value = !isSidebarOpen.value)}
              className="md:hidden p-2.5 rounded-xl bg-zinc-950/60 border border-white/5 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all cursor-pointer mr-1 flex items-center justify-center min-h-[44px] min-w-[44px]"
              title="Toggle left sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="relative hidden xs:flex items-center justify-center w-10 h-10 rounded-xl bg-blue-950/40 border border-blue-500/20 shadow-[0_0_15px_rgba(0,102,255,0.1)]">
              <Terminal className="w-5 h-5 text-blue-500" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <h1 className="text-sm md:text-xl font-black font-orbitron tracking-tighter uppercase italic bg-gradient-to-r from-blue-500 via-white to-blue-400 bg-clip-text text-transparent">
                  PROMETHEUS OS
                </h1>
                <span className="text-[7px] md:text-[7.5px] font-bold text-blue-400 px-1 py-0.5 md:px-1.5 rounded bg-blue-950/50 border border-blue-500/20 font-orbitron">
                  VUE 3
                </span>
                <span className="text-[7.5px] md:text-[8px] font-bold text-blue-400 px-1.5 py-0.5 rounded bg-blue-950/35 border border-blue-500/25 font-orbitron uppercase tracking-wider">
                  {getModeLabel(currentMode.value)}
                </span>
              </div>
              <p className="hidden sm:block text-[8px] tracking-[0.3em] font-black text-zinc-500 font-orbitron uppercase">
                Sovereign Link • Prometheus OS Kernel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-950 border border-white/5 text-[9px] font-bold text-zinc-400 font-mono-tech">
              <Sparkles className="w-3 h-3 text-blue-400 animate-spin" />
              {messages.value.length} CACHED NODES
            </div>

            <button
              onClick={clearSession}
              className="hidden sm:inline-flex p-2.5 rounded-xl border border-white/5 bg-zinc-950/40 text-zinc-400 hover:text-blue-400 hover:border-blue-500/30 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
              title="Flush session logs"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={exportSession}
              className="hidden sm:inline-flex p-2.5 rounded-xl border border-white/5 bg-zinc-950/40 text-zinc-400 hover:text-blue-400 hover:border-blue-500/30 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
              title="Download Markdown session"
            >
              <FileDown className="w-4 h-4" />
            </button>

            {/* Core Status CPU toggle button on all screens */}
            <button
              onClick={() => (isTelemetryOpen.value = !isTelemetryOpen.value)}
              className="px-2 py-2 rounded-xl bg-blue-950/40 border border-blue-500/20 text-[8px] md:text-[9.5px] font-bold text-blue-400 font-orbitron hover:bg-blue-500/15 cursor-pointer flex items-center gap-1 shadow-[0_0_10px_rgba(0,102,255,0.1)] min-h-[44px]"
              title="Toggle Core Status Telemetry"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>CORE STATUS</span>
            </button>

            <button
              onClick={() => (isPaletteOpen.value = true)}
              className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-[9px] md:text-[10px] font-orbitron hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,102,255,0.2)] cursor-pointer min-h-[44px]"
            >
              <Command className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">COMMANDS</span>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[8px] bg-black/10 font-bold font-mono-tech select-none ml-1">
                ⌘K
              </kbd>
            </button>
          </div>
        </header>

        {/* OS Workspace grid */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Left Sidebar */}
          <LeftSidebar
            currentMode={currentMode.value}
            onModeChange={(m: string) => (currentMode.value = m)}
            sessions={sessions.value}
            currentSessionId={currentSessionId.value}
            onSelectSession={handleSelectSession}
            onNewSession={handleNewSession}
            onDeleteSession={handleDeleteSession}
            onRenameSession={handleRenameSession}
            onTogglePinSession={handleTogglePinSession}
            theme={theme.value}
            onToggleTheme={handleToggleTheme}
            userName={userName.value}
            onChangeUserName={(val: string) => {
              userName.value = val;
              localStorage.setItem("prometheus_user_name", val);
            }}
            voicePref={voicePref.value}
            onChangeVoicePref={handleChangeVoicePref}
            class={`mobile-drawer-left md:relative md:z-30 h-full md:bg-[#030612]/30 border-r border-white/5 md:transition-all md:duration-300 md:transform ${
              isSidebarOpen.value 
                ? "drawer-open md:translate-x-0 md:opacity-100 md:w-80 md:min-w-80" 
                : "drawer-closed md:translate-x-0 md:w-0 md:min-w-0 md:overflow-hidden md:!p-0 md:!border-r-0 md:opacity-100 md:pointer-events-auto"
            } ${
              isMainUiVisible.value 
                ? "opacity-100" 
                : "opacity-0 pointer-events-none"
            }`}
          />

          {/* Central feed */}
          <section className={`flex-1 flex flex-col overflow-hidden bg-black/10 relative z-10 transition-all duration-[1000ms] ease-out ${
            isMainUiVisible.value 
              ? "opacity-100 scale-100 blur-0" 
              : "opacity-0 scale-95 blur-md pointer-events-none"
          }`}>
            <button
              onClick={() => (isSidebarOpen.value = !isSidebarOpen.value)}
              className="hidden md:inline-flex absolute top-4 left-4 p-2.5 rounded-xl bg-zinc-950/60 border border-white/5 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 z-40 transition-all shadow-md cursor-pointer"
              title="Toggle left sidebar"
            >
              {isSidebarOpen.value ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>

            <button
              onClick={() => (isTelemetryOpen.value = !isTelemetryOpen.value)}
              className="hidden md:inline-flex absolute top-4 right-4 p-2.5 rounded-xl bg-zinc-950/60 border border-white/5 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 z-40 transition-all shadow-md cursor-pointer"
              title="Toggle telemetry panel"
            >
              {isTelemetryOpen.value ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </button>

            <ChatPanel
              messages={messages.value}
              loading={loading.value}
              onSelectPrompt={handleSelectPrompt}
              onCodeAction={handleCodeAction}
              onSelectFileOption={handleSelectFileOption}
            />

            <FeaturesDrawer
              isOpen={isFeaturesOpen.value}
              onClose={() => (isFeaturesOpen.value = false)}
              onSelectFeature={handleSelectFeature}
            />

            <PromptComposer
              v-model={input.value}
              isListening={isVoiceInputActive.value}
              disabled={loading.value}
              onSend={() => handleSend()}
              onToggleVoice={toggleSpeechToText}
              onOpenFeatures={() => (isFeaturesOpen.value = !isFeaturesOpen.value)}
              onFileUploaded={handleFileUploaded}
            />
          </section>

          {/* Right sidebar telemetry */}
          <aside
            className={`mobile-drawer-right md:relative md:z-30 md:w-80 md:h-full md:bg-[#030612]/30 border-l border-white/5 md:transition-all md:duration-300 md:transform md:rounded-none p-6 overflow-y-auto ${
              isTelemetryOpen.value 
                ? "drawer-open md:translate-y-0 md:opacity-100 md:w-80 md:min-w-80" 
                : "drawer-closed md:translate-y-0 md:w-0 md:min-w-0 md:overflow-hidden md:!p-0 md:!border-l-0 md:opacity-100 md:pointer-events-auto"
            } ${
              isMainUiVisible.value 
                ? "opacity-100" 
                : "opacity-0 pointer-events-none"
            }`}
          >
            <SystemTelemetryPanel
              currentMode={currentMode.value}
              isVoiceInputActive={isVoiceInputActive.value}
              isTtsActive={isTtsActive.value}
              messagesCount={messages.value.length}
              isStreaming={loading.value}
              onClose={() => (isTelemetryOpen.value = false)}
            />
          </aside>
        </div>

        {/* Modal views */}
        <CommandPalette
          isOpen={isPaletteOpen.value}
          onClose={() => (isPaletteOpen.value = false)}
          onSelectCommand={handlePaletteCommand}
        />

        <PromptLibrary
          isOpen={isLibraryOpen.value}
          onClose={() => (isLibraryOpen.value = false)}
          onSelectPrompt={handleSelectPrompt}
        />

        <MissionControl
          isOpen={isMissionOpen.value}
          onClose={() => (isMissionOpen.value = false)}
        />

        <DSAVisualizer
          isOpen={isDsaOpen.value}
          onClose={() => (isDsaOpen.value = false)}
        />

        <FileWorkspacePanel
          isOpen={isFilePanelOpen.value}
          onClose={() => (isFilePanelOpen.value = false)}
          uploadedFile={uploadedFile.value}
          onRemoveFile={() => {
            uploadedFile.value = null;
          }}
          onSelectAction={(actionId: string) => {
            if (uploadedFile.value) {
              handleSelectFileOption(actionId, {
                name: uploadedFile.value.name,
                type: uploadedFile.value.type
              });
            }
          }}
          onUploadClick={() => {
            const fileInput = document.getElementById("prometheus-file-input");
            fileInput?.click();
          }}
        />



        {/* Cinematic splash opening animation */}
        {showIntro.value && (
          <SplashIntro
            onStartTransition={handleIntroStartTransition}
            onComplete={handleIntroComplete}
          />
        )}

        {/* User onboarding name input overlay */}
        {showOnboarding.value && (
          <UserOnboarding
            onComplete={handleOnboardingComplete}
          />
        )}

      </div>
    );
  },
});
