/*
 * Sakura Google OAuth launcher v1.0
 * Mobile/PWA-safe launch layer for Supabase Google sign-in.
 * Keeps Sakura's existing auth/session handling in sakura-auth.js unchanged.
 */
(function initializeSakuraGoogleOAuthLauncher() {
    if (window.SakuraGoogleOAuthLauncher) return;

    const config = window.SAKURA_AUTH_CONFIG || {};
    let launching = false;

    function getRedirectUrl() {
        const configured = String(config.redirectUrl || "").trim();
        if (location.origin === "https://chachinn.github.io" && configured) return configured;
        const path = location.pathname.endsWith("/")
            ? location.pathname
            : location.pathname.replace(/[^/]*$/, "");
        return `${location.origin}${path || "/"}`;
    }

    function setMessage(message, tone = "") {
        const element = document.getElementById("sakura-auth-message");
        if (!element) return;
        element.textContent = message || "";
        element.dataset.tone = tone;
    }

    function setControlsBusy(busy) {
        document.querySelectorAll("#sakura-auth-dialog button, #sakura-auth-dialog input").forEach(element => {
            if (element.id === "sakura-auth-close") return;
            element.disabled = busy;
        });
        const googleButton = document.getElementById("sakura-auth-google");
        if (googleButton) {
            if (busy) googleButton.setAttribute("aria-busy", "true");
            else googleButton.removeAttribute("aria-busy");
        }
    }

    function friendlyLaunchError(error) {
        const raw = String(error?.message || "").trim();
        const lower = raw.toLowerCase();
        if (lower.includes("network") || lower.includes("fetch")) {
            return "Sakura couldn't reach Google sign-in. Check your internet connection and try again.";
        }
        return "Google sign-in couldn't open. Please try again.";
    }

    function validateOAuthUrl(value) {
        const raw = String(value || "").trim();
        if (!raw) throw new Error("Supabase did not return a Google sign-in URL.");
        const oauthUrl = new URL(raw);
        const projectUrl = new URL(String(config.projectUrl || ""));
        if (oauthUrl.protocol !== "https:" || oauthUrl.origin !== projectUrl.origin) {
            throw new Error("Unexpected Google sign-in URL.");
        }
        if (!oauthUrl.pathname.startsWith("/auth/v1/authorize")) {
            throw new Error("Unexpected Google sign-in route.");
        }
        return oauthUrl.href;
    }

    async function launchGoogleOAuth(client) {
        if (launching) return;
        launching = true;
        setControlsBusy(true);
        setMessage("Opening Google sign-in…");

        try {
            const { data, error } = await client.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: getRedirectUrl(),
                    skipBrowserRedirect: true
                }
            });
            if (error) throw error;

            const oauthUrl = validateOAuthUrl(data?.url);
            window.location.assign(oauthUrl);
        }
        catch (error) {
            console.error("Sakura Google sign-in launch failed.", error);
            launching = false;
            setControlsBusy(false);
            setMessage(friendlyLaunchError(error), "error");
        }
    }

    function handleGoogleClick(event) {
        const target = event.target instanceof Element
            ? event.target.closest("#sakura-auth-google")
            : null;
        if (!target || launching) return;

        const client = window.SakuraAuth?.getClient?.();
        if (!client) return; // Let Sakura's existing handler show its loading message.

        event.preventDefault();
        event.stopImmediatePropagation();
        launchGoogleOAuth(client);
    }

    document.addEventListener("click", handleGoogleClick, true);
    window.addEventListener("pageshow", () => {
        if (!launching) return;
        launching = false;
        setControlsBusy(false);
    });

    window.SakuraGoogleOAuthLauncher = Object.freeze({
        launch: () => {
            const client = window.SakuraAuth?.getClient?.();
            if (!client) throw new Error("Sakura Account is still connecting.");
            return launchGoogleOAuth(client);
        }
    });
}());
