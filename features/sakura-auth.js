/*
 * Sakura Account Foundation v1.0
 * Browser-safe Supabase Auth client for Google + email/password.
 * Premium locking is intentionally disabled in this phase.
 */
(function initializeSakuraAuth() {
    if (window.SakuraAuth) return;

    const config = window.SAKURA_AUTH_CONFIG || {};
    const state = {
        client: null,
        session: null,
        access: null,
        initialized: false,
        loading: false,
        trialSecondsAtSync: 0,
        trialSyncedAt: 0,
        countdownTimer: null
    };

    const selectors = {
        headerActions: ".header-actions",
        hubAbout: ".hub-about-sakura"
    };

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

    function friendlyError(error, fallback) {
        const raw = String(error?.message || "").trim();
        if (!raw) return fallback;
        const lower = raw.toLowerCase();
        if (lower.includes("invalid login credentials")) return "That email or password doesn't match. Please try again.";
        if (lower.includes("email not confirmed")) return "Please confirm your email first, then log in again.";
        if (lower.includes("user already registered")) return "An account already exists for that email. Try logging in instead.";
        if (lower.includes("password should be")) return "Please choose a stronger password with at least 8 characters.";
        if (lower.includes("rate limit")) return "Too many attempts right now. Please wait a little and try again.";
        if (lower.includes("network") || lower.includes("fetch")) return "Sakura couldn't reach the account service. Check your internet connection and try again.";
        return raw.length <= 180 ? raw : fallback;
    }

    function loadSupabaseSdk() {
        if (window.supabase?.createClient) return Promise.resolve(window.supabase);
        const existing = document.querySelector("script[data-sakura-supabase-sdk]");
        if (existing) {
            return new Promise((resolve, reject) => {
                if (window.supabase?.createClient) { resolve(window.supabase); return; }
                existing.addEventListener("load", () => window.supabase?.createClient ? resolve(window.supabase) : reject(new Error("Supabase SDK did not initialize.")), { once:true });
                existing.addEventListener("error", () => reject(new Error("Supabase SDK could not load.")), { once:true });
            });
        }
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
            script.dataset.sakuraSupabaseSdk = "true";
            script.async = true;
            script.onload = () => window.supabase?.createClient ? resolve(window.supabase) : reject(new Error("Supabase SDK did not initialize."));
            script.onerror = () => reject(new Error("Supabase SDK could not load."));
            document.head.appendChild(script);
        });
    }

    function injectStyles() {
        if (document.getElementById("sakura-auth-styles")) return;
        const style = document.createElement("style");
        style.id = "sakura-auth-styles";
        style.textContent = `
            .sakura-account-header-button{position:relative}
            .sakura-account-header-button[data-signed-in="true"]::after{content:"";position:absolute;right:3px;bottom:3px;width:7px;height:7px;border:2px solid var(--color-background);border-radius:50%;background:var(--color-primary)}
            .sakura-account-hub-card{display:grid;gap:9px;margin:0 0 12px;padding:12px;border:1px solid color-mix(in srgb,var(--color-primary) 18%,var(--color-border));border-radius:15px;background:var(--color-surface)}
            .sakura-account-hub-top{display:flex;align-items:center;gap:9px;min-width:0}
            .sakura-account-avatar{display:grid;place-items:center;flex:0 0 36px;width:36px;height:36px;border-radius:50%;background:var(--color-primary-soft);color:var(--color-primary-dark);font-size:15px;font-weight:900;overflow:hidden}
            .sakura-account-avatar img{width:100%;height:100%;object-fit:cover}
            .sakura-account-hub-copy{min-width:0;display:grid;gap:2px}
            .sakura-account-hub-copy strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:10px;color:var(--color-text)}
            .sakura-account-hub-copy small{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--color-text-muted);font-size:8px}
            .sakura-account-status{display:inline-flex;width:max-content;max-width:100%;align-items:center;gap:4px;padding:4px 7px;border-radius:999px;background:var(--color-primary-soft);color:var(--color-primary-dark);font-size:8px;font-weight:900}
            .sakura-account-hub-action{width:100%;min-height:39px}
            .sakura-auth-dialog{width:min(94vw,430px);max-height:min(88vh,720px);padding:0;border:0;border-radius:22px;background:transparent;color:var(--color-text);overflow:visible}
            .sakura-auth-dialog::backdrop{background:rgba(35,24,31,.46);backdrop-filter:blur(5px)}
            .sakura-auth-card{max-height:min(88vh,720px);overflow:auto;padding:18px;border:1px solid var(--color-border);border-radius:22px;background:var(--color-background);box-shadow:0 22px 60px rgba(35,24,31,.2);overscroll-behavior:contain}
            .sakura-auth-card *{box-sizing:border-box}
            .sakura-auth-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}
            .sakura-auth-heading h2{margin:2px 0 0;font-size:21px;line-height:1.2}
            .sakura-auth-intro{margin:0 0 14px;color:var(--color-text-muted);font-size:10px;line-height:1.55}
            .sakura-auth-google{width:100%;min-height:46px;display:flex;align-items:center;justify-content:center;gap:9px;border:1px solid var(--color-border);border-radius:13px;background:var(--color-surface);color:var(--color-text);font:inherit;font-size:11px;font-weight:850;cursor:pointer;touch-action:manipulation}
            .sakura-auth-google span{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#fff;color:#4285f4;font-weight:950;box-shadow:0 1px 4px rgba(0,0,0,.12)}
            .sakura-auth-divider{display:flex;align-items:center;gap:9px;margin:14px 0;color:var(--color-text-muted);font-size:8px;text-transform:uppercase;letter-spacing:.08em}
            .sakura-auth-divider::before,.sakura-auth-divider::after{content:"";height:1px;flex:1;background:var(--color-border)}
            .sakura-auth-form{display:grid;gap:10px}
            .sakura-auth-form label{display:grid;gap:5px;color:var(--color-text);font-size:9px;font-weight:800}
            .sakura-auth-form input{width:100%;min-height:44px;padding:10px 11px;border:1px solid var(--color-border);border-radius:11px;background:var(--color-surface);color:var(--color-text);font:inherit;font-size:11px;outline:none}
            .sakura-auth-form input:focus{border-color:var(--color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--color-primary) 14%,transparent)}
            .sakura-auth-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:2px}
            .sakura-auth-actions button{min-height:43px}
            .sakura-auth-link{justify-self:center;padding:4px 7px;border:0;background:none;color:var(--color-primary-dark);font:inherit;font-size:9px;font-weight:850;text-decoration:underline;text-underline-offset:3px;cursor:pointer}
            .sakura-auth-message{min-height:18px;margin:9px 0 0;padding:0;color:var(--color-text-muted);font-size:9px;line-height:1.45;text-align:center}
            .sakura-auth-message[data-tone="error"]{color:#b23a4a}
            .sakura-auth-message[data-tone="success"]{color:#2e7d59}
            .sakura-auth-trial-note{margin:13px 0 0;padding:10px 11px;border-radius:12px;background:var(--color-primary-soft);color:var(--color-text-muted);font-size:9px;line-height:1.5}
            .sakura-auth-trial-note strong{color:var(--color-primary-dark)}
            .sakura-account-panel{display:grid;gap:12px}
            .sakura-account-identity{display:grid;grid-template-columns:auto minmax(0,1fr);gap:10px;align-items:center;padding:11px;border:1px solid var(--color-border);border-radius:14px;background:var(--color-surface)}
            .sakura-account-identity .sakura-account-avatar{width:46px;height:46px;flex-basis:46px;font-size:18px}
            .sakura-account-identity-copy{min-width:0;display:grid;gap:3px}
            .sakura-account-identity-copy strong,.sakura-account-identity-copy small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
            .sakura-account-identity-copy strong{font-size:11px}.sakura-account-identity-copy small{font-size:9px;color:var(--color-text-muted)}
            .sakura-account-plan{display:grid;gap:6px;padding:12px;border-radius:14px;background:var(--color-primary-soft)}
            .sakura-account-plan strong{font-size:11px;color:var(--color-primary-dark)}
            .sakura-account-plan span{font-size:9px;line-height:1.5;color:var(--color-text-muted)}
            .sakura-account-panel-actions{display:grid;gap:8px}
            .sakura-account-panel-actions button{width:100%;min-height:42px}
            .sakura-auth-offline{padding:11px;border:1px dashed var(--color-border);border-radius:12px;color:var(--color-text-muted);font-size:9px;line-height:1.5;text-align:center}
            @media(max-width:380px){.sakura-auth-actions{grid-template-columns:1fr}.sakura-auth-card{padding:15px}.sakura-auth-dialog{width:96vw}}
            @media(prefers-reduced-motion:reduce){.sakura-auth-dialog::backdrop{backdrop-filter:none}}
        `;
        document.head.appendChild(style);
    }

    function createAvatarContent(container, user) {
        container.replaceChildren();
        const avatarUrl = String(user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "").trim();
        if (avatarUrl && /^https:\/\//i.test(avatarUrl)) {
            const image = document.createElement("img");
            image.src = avatarUrl;
            image.alt = "";
            image.referrerPolicy = "no-referrer";
            image.onerror = () => {
                container.replaceChildren();
                container.textContent = getInitial(user);
            };
            container.appendChild(image);
            return;
        }
        container.textContent = getInitial(user);
    }

    function getInitial(user) {
        const name = String(user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "S").trim();
        return (name[0] || "S").toUpperCase();
    }

    function getDisplayName(user) {
        return String(user?.user_metadata?.full_name || user?.user_metadata?.name || "Sakura learner").trim() || "Sakura learner";
    }

    function injectUi() {
        injectStyles();

        const headerActions = document.querySelector(selectors.headerActions);
        if (headerActions && !document.getElementById("sakura-account-header")) {
            const button = document.createElement("button");
            button.id = "sakura-account-header";
            button.className = "icon-button sakura-account-header-button";
            button.type = "button";
            button.setAttribute("aria-label", "Open Sakura account");
            button.textContent = "人";
            button.addEventListener("click", openAccount);
            headerActions.appendChild(button);
        }

        const hubAbout = document.querySelector(selectors.hubAbout);
        if (hubAbout && !document.getElementById("sakura-account-hub-card")) {
            const card = document.createElement("section");
            card.id = "sakura-account-hub-card";
            card.className = "sakura-account-hub-card";
            card.setAttribute("aria-label", "Sakura account");
            const top = document.createElement("div");
            top.className = "sakura-account-hub-top";
            const avatar = document.createElement("div");
            avatar.id = "sakura-account-hub-avatar";
            avatar.className = "sakura-account-avatar";
            avatar.setAttribute("aria-hidden", "true");
            avatar.textContent = "S";
            const copy = document.createElement("div");
            copy.className = "sakura-account-hub-copy";
            const title = document.createElement("strong");
            title.id = "sakura-account-hub-title";
            title.textContent = "Sakura Account";
            const subtitle = document.createElement("small");
            subtitle.id = "sakura-account-hub-subtitle";
            subtitle.textContent = "Sign in to prepare cloud sync and Premium access.";
            const status = document.createElement("span");
            status.id = "sakura-account-hub-status";
            status.className = "sakura-account-status";
            status.textContent = "Signed out";
            copy.append(title, subtitle, status);
            top.append(avatar, copy);
            const action = document.createElement("button");
            action.id = "sakura-account-hub-action";
            action.className = "secondary-button sakura-account-hub-action";
            action.type = "button";
            action.textContent = "Sign In / Create Account";
            action.addEventListener("click", openAccount);
            card.append(top, action);
            hubAbout.insertAdjacentElement("afterend", card);
        }

        if (!document.getElementById("sakura-auth-dialog")) {
            const dialog = document.createElement("dialog");
            dialog.id = "sakura-auth-dialog";
            dialog.className = "sakura-auth-dialog";
            dialog.setAttribute("aria-labelledby", "sakura-auth-title");
            dialog.innerHTML = `
                <div class="sakura-auth-card">
                    <div class="sakura-auth-heading">
                        <div><span class="section-kicker">Sakura Account</span><h2 id="sakura-auth-title">Welcome to Sakura 🌸</h2></div>
                        <button id="sakura-auth-close" class="icon-button" type="button" aria-label="Close account">×</button>
                    </div>
                    <div id="sakura-auth-body"></div>
                    <p id="sakura-auth-message" class="sakura-auth-message" role="status" aria-live="polite"></p>
                </div>`;
            document.body.appendChild(dialog);
            dialog.querySelector("#sakura-auth-close")?.addEventListener("click", () => dialog.close());
            dialog.addEventListener("click", event => {
                if (event.target === dialog) dialog.close();
            });
        }
        render();
    }

    function trialSecondsRemaining() {
        if (!state.access || state.access.effective_tier !== "trial") return 0;
        const elapsed = state.trialSyncedAt ? Math.floor((performance.now() - state.trialSyncedAt) / 1000) : 0;
        return Math.max(0, Number(state.trialSecondsAtSync || 0) - elapsed);
    }

    function formatTrialRemaining(seconds) {
        const total = Math.max(0, Number(seconds || 0));
        if (total <= 0) return "Trial ending";
        const days = Math.floor(total / 86400);
        const hours = Math.floor((total % 86400) / 3600);
        if (days >= 1) return `${days}d ${hours}h left`;
        const minutes = Math.max(1, Math.ceil((total % 3600) / 60));
        return `${hours}h ${minutes}m left`;
    }

    function accessLabel() {
        const tier = state.access?.effective_tier;
        if (tier === "lifetime") return "Lifetime Premium";
        if (tier === "premium") return "Sakura Premium";
        if (tier === "trial") return `Premium Trial · ${formatTrialRemaining(trialSecondsRemaining())}`;
        return state.session ? "Free" : "Signed out";
    }

    function accessDescription() {
        const tier = state.access?.effective_tier;
        if (tier === "lifetime") return "Full Sakura access with no expiry.";
        if (tier === "premium") return "Your Sakura Premium membership is active.";
        if (tier === "trial") return "Your Sakura account is currently in its one-time 3-day Premium trial.";
        return "Your account is on Sakura Free.";
    }

    function updateChrome() {
        const user = state.session?.user || null;
        const headerButton = document.getElementById("sakura-account-header");
        if (headerButton) {
            headerButton.dataset.signedIn = user ? "true" : "false";
            headerButton.textContent = user ? getInitial(user) : "人";
            headerButton.setAttribute("aria-label", user ? `Open Sakura account for ${user.email || "signed-in user"}` : "Sign in to Sakura");
        }

        const avatar = document.getElementById("sakura-account-hub-avatar");
        const title = document.getElementById("sakura-account-hub-title");
        const subtitle = document.getElementById("sakura-account-hub-subtitle");
        const status = document.getElementById("sakura-account-hub-status");
        const action = document.getElementById("sakura-account-hub-action");
        if (avatar) createAvatarContent(avatar, user);
        if (title) title.textContent = user ? getDisplayName(user) : "Sakura Account";
        if (subtitle) subtitle.textContent = user ? (user.email || "Signed in") : "Sign in to prepare cloud sync and Premium access.";
        if (status) status.textContent = accessLabel();
        if (action) action.textContent = user ? "Manage Account" : "Sign In / Create Account";
    }

    function renderSignedOut(body) {
        body.innerHTML = `
            <p class="sakura-auth-intro">Sign in to keep your Sakura account ready for cloud backup, restore, cross-device progress, and Premium access.</p>
            <button id="sakura-auth-google" class="sakura-auth-google" type="button"><span aria-hidden="true">G</span>Continue with Google</button>
            <div class="sakura-auth-divider">or use email</div>
            <form id="sakura-auth-form" class="sakura-auth-form" novalidate>
                <label>Email<input id="sakura-auth-email" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" required></label>
                <label>Password<input id="sakura-auth-password" type="password" autocomplete="current-password" required></label>
                <div class="sakura-auth-actions"><button id="sakura-auth-login" class="primary-button" type="submit">Log In</button><button id="sakura-auth-signup" class="secondary-button" type="button">Create Account</button></div>
                <button id="sakura-auth-forgot" class="sakura-auth-link" type="button">Forgot password?</button>
            </form>
            <div class="sakura-auth-trial-note"><strong>🌸 3 days of Premium included.</strong><br>New Sakura accounts automatically receive a one-time 72-hour Premium trial.</div>`;

        body.querySelector("#sakura-auth-google")?.addEventListener("click", signInWithGoogle);
        body.querySelector("#sakura-auth-form")?.addEventListener("submit", event => {
            event.preventDefault();
            signInWithEmail();
        });
        body.querySelector("#sakura-auth-signup")?.addEventListener("click", signUpWithEmail);
        body.querySelector("#sakura-auth-forgot")?.addEventListener("click", renderForgotPassword);
    }

    function renderSignedIn(body) {
        const user = state.session.user;
        body.replaceChildren();
        const intro = document.createElement("p");
        intro.className = "sakura-auth-intro";
        intro.textContent = "You're signed in. This account will become the home for Sakura cloud backup, restore, progress sync, and subscription access.";

        const identity = document.createElement("section");
        identity.className = "sakura-account-identity";
        const avatar = document.createElement("div");
        avatar.className = "sakura-account-avatar";
        avatar.setAttribute("aria-hidden", "true");
        createAvatarContent(avatar, user);
        const copy = document.createElement("div");
        copy.className = "sakura-account-identity-copy";
        const name = document.createElement("strong");
        name.textContent = getDisplayName(user);
        const email = document.createElement("small");
        email.textContent = user.email || "Signed in";
        copy.append(name, email);
        identity.append(avatar, copy);

        const plan = document.createElement("section");
        plan.className = "sakura-account-plan";
        const planTitle = document.createElement("strong");
        planTitle.id = "sakura-auth-plan-label";
        planTitle.textContent = accessLabel();
        const planCopy = document.createElement("span");
        planCopy.id = "sakura-auth-plan-copy";
        planCopy.textContent = accessDescription();
        plan.append(planTitle, planCopy);

        const actions = document.createElement("div");
        actions.className = "sakura-account-panel-actions";
        const refresh = document.createElement("button");
        refresh.className = "secondary-button";
        refresh.type = "button";
        refresh.textContent = "Refresh Account Status";
        refresh.addEventListener("click", async () => {
            setMessage("Refreshing account…");
            await refreshAccess();
            setMessage("Account status refreshed.", "success");
        });
        const logout = document.createElement("button");
        logout.className = "text-danger-button";
        logout.type = "button";
        logout.textContent = "Log Out";
        logout.addEventListener("click", signOut);
        actions.append(refresh, logout);

        body.append(intro, identity, plan, actions);
    }

    function render() {
        updateChrome();
        const body = document.getElementById("sakura-auth-body");
        if (!body) return;
        if (!navigator.onLine && !state.session) {
            body.innerHTML = `<div class="sakura-auth-offline"><strong>You're offline.</strong><br>Account sign-in needs an internet connection. Sakura's offline learning features can keep working normally.</div>`;
            return;
        }
        if (state.session?.user) renderSignedIn(body);
        else renderSignedOut(body);
    }

    function renderForgotPassword() {
        const body = document.getElementById("sakura-auth-body");
        if (!body) return;
        setMessage("");
        body.innerHTML = `
            <p class="sakura-auth-intro">Enter your Sakura account email and we'll send a secure password-reset link.</p>
            <form id="sakura-reset-request-form" class="sakura-auth-form" novalidate>
                <label>Email<input id="sakura-reset-email" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" required></label>
                <div class="sakura-auth-actions"><button class="primary-button" type="submit">Send Reset Link</button><button id="sakura-reset-back" class="secondary-button" type="button">Back to Login</button></div>
            </form>`;
        body.querySelector("#sakura-reset-request-form")?.addEventListener("submit", requestPasswordReset);
        body.querySelector("#sakura-reset-back")?.addEventListener("click", render);
    }

    function renderPasswordRecovery() {
        openAccount();
        const body = document.getElementById("sakura-auth-body");
        if (!body) return;
        setMessage("");
        body.innerHTML = `
            <p class="sakura-auth-intro">Choose a new password for your Sakura account.</p>
            <form id="sakura-password-update-form" class="sakura-auth-form" novalidate>
                <label>New password<input id="sakura-new-password" type="password" minlength="8" autocomplete="new-password" required></label>
                <label>Confirm new password<input id="sakura-new-password-confirm" type="password" minlength="8" autocomplete="new-password" required></label>
                <button class="primary-button" type="submit">Save New Password</button>
            </form>`;
        body.querySelector("#sakura-password-update-form")?.addEventListener("submit", updatePassword);
    }

    function formCredentials() {
        const email = String(document.getElementById("sakura-auth-email")?.value || "").trim();
        const password = String(document.getElementById("sakura-auth-password")?.value || "");
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) throw new Error("Enter a valid email address.");
        if (!password) throw new Error("Enter your password.");
        return { email, password };
    }

    function setAuthBusy(busy) {
        state.loading = busy;
        document.querySelectorAll("#sakura-auth-dialog button, #sakura-auth-dialog input").forEach(element => {
            if (element.id === "sakura-auth-close") return;
            element.disabled = busy;
        });
    }

    async function signInWithGoogle() {
        if (!state.client || state.loading) { setMessage("Sakura Account is still connecting. Please try again in a moment.", "error"); return; }
        setAuthBusy(true);
        setMessage("Opening Google sign-in…");
        try {
            const { error } = await state.client.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: getRedirectUrl() }
            });
            if (error) throw error;
        }
        catch (error) {
            console.error("Sakura Google sign-in failed.", error);
            setMessage(friendlyError(error, "Google sign-in couldn't start."), "error");
            setAuthBusy(false);
        }
    }

    async function signInWithEmail() {
        if (!state.client || state.loading) return;
        setMessage("");
        try {
            const { email, password } = formCredentials();
            setAuthBusy(true);
            setMessage("Logging in…");
            const { error } = await state.client.auth.signInWithPassword({ email, password });
            if (error) throw error;
            setMessage("Welcome back to Sakura.", "success");
        }
        catch (error) {
            console.error("Sakura email login failed.", error);
            setMessage(friendlyError(error, "Sakura couldn't log you in."), "error");
        }
        finally { setAuthBusy(false); }
    }

    async function signUpWithEmail() {
        if (!state.client || state.loading) return;
        setMessage("");
        try {
            const { email, password } = formCredentials();
            if (password.length < 8) throw new Error("Please use at least 8 characters for your password.");
            setAuthBusy(true);
            setMessage("Creating your Sakura account…");
            const { data, error } = await state.client.auth.signUp({
                email,
                password,
                options: { emailRedirectTo: getRedirectUrl() }
            });
            if (error) throw error;
            if (data?.session) {
                setMessage("Your Sakura account is ready. Your 3-day Premium trial has started. 🌸", "success");
            }
            else {
                setMessage("Account created! Check your email and tap the confirmation link to finish signing in.", "success");
            }
        }
        catch (error) {
            console.error("Sakura account creation failed.", error);
            setMessage(friendlyError(error, "Sakura couldn't create the account."), "error");
        }
        finally { setAuthBusy(false); }
    }

    async function requestPasswordReset(event) {
        event.preventDefault();
        if (!state.client || state.loading) return;
        const email = String(document.getElementById("sakura-reset-email")?.value || "").trim();
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) { setMessage("Enter a valid email address.", "error"); return; }
        setAuthBusy(true);
        setMessage("Sending reset link…");
        try {
            const { error } = await state.client.auth.resetPasswordForEmail(email, { redirectTo: getRedirectUrl() });
            if (error) throw error;
            setMessage("Password reset email sent. Open the link in that email to choose a new password.", "success");
        }
        catch (error) {
            console.error("Sakura password reset request failed.", error);
            setMessage(friendlyError(error, "Sakura couldn't send the reset email."), "error");
        }
        finally { setAuthBusy(false); }
    }

    async function updatePassword(event) {
        event.preventDefault();
        if (!state.client || state.loading) return;
        const password = String(document.getElementById("sakura-new-password")?.value || "");
        const confirmPassword = String(document.getElementById("sakura-new-password-confirm")?.value || "");
        if (password.length < 8) { setMessage("Use at least 8 characters for your new password.", "error"); return; }
        if (password !== confirmPassword) { setMessage("Those passwords don't match yet.", "error"); return; }
        setAuthBusy(true);
        setMessage("Saving new password…");
        try {
            const { error } = await state.client.auth.updateUser({ password });
            if (error) throw error;
            setMessage("Password updated successfully.", "success");
            render();
        }
        catch (error) {
            console.error("Sakura password update failed.", error);
            setMessage(friendlyError(error, "Sakura couldn't update the password."), "error");
        }
        finally { setAuthBusy(false); }
    }

    async function signOut() {
        if (!state.client || state.loading) return;
        setAuthBusy(true);
        setMessage("Logging out…");
        try {
            const { error } = await state.client.auth.signOut();
            if (error) throw error;
            state.session = null;
            state.access = null;
            render();
            setMessage("You're logged out. Your local Sakura data on this device is unchanged.", "success");
        }
        catch (error) {
            console.error("Sakura logout failed.", error);
            setMessage(friendlyError(error, "Sakura couldn't log out."), "error");
        }
        finally { setAuthBusy(false); }
    }

    async function refreshAccess() {
        if (!state.client || !state.session?.user) {
            state.access = null;
            state.trialSecondsAtSync = 0;
            state.trialSyncedAt = 0;
            render();
            return null;
        }
        try {
            const { data, error } = await state.client.rpc("get_my_sakura_access");
            if (error) throw error;
            const row = Array.isArray(data) ? (data[0] || null) : data;
            state.access = row;
            state.trialSecondsAtSync = Number(row?.trial_seconds_remaining || 0);
            state.trialSyncedAt = performance.now();
            render();
            return row;
        }
        catch (error) {
            console.error("Sakura entitlement refresh failed.", error);
            state.access = null;
            render();
            return null;
        }
    }

    function startCountdown() {
        if (state.countdownTimer) clearInterval(state.countdownTimer);
        state.countdownTimer = setInterval(() => {
            if (state.access?.effective_tier !== "trial") return;
            const label = accessLabel();
            const hubStatus = document.getElementById("sakura-account-hub-status");
            const dialogPlan = document.getElementById("sakura-auth-plan-label");
            if (hubStatus) hubStatus.textContent = label;
            if (dialogPlan) dialogPlan.textContent = label;
            if (trialSecondsRemaining() <= 0) refreshAccess();
        }, 60000);
    }

    async function openAccount() {
        injectUi();
        const dialog = document.getElementById("sakura-auth-dialog");
        if (!dialog) return;
        setMessage("");
        render();
        if (!state.client && navigator.onLine) initialize();
        if (!dialog.open) {
            if (typeof dialog.showModal === "function") dialog.showModal();
            else dialog.setAttribute("open", "");
        }
    }

    async function initialize() {
        if (state.initialized) return window.SakuraAuth;
        injectUi();
        if (!config.enabled || !config.projectUrl || !config.publishableKey) {
            console.warn("Sakura Account is not configured yet.");
            return window.SakuraAuth;
        }
        try {
            const sdk = await loadSupabaseSdk();
            state.client = sdk.createClient(config.projectUrl, config.publishableKey, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true,
                    storageKey: "sakura-auth-session-v1"
                }
            });

            state.client.auth.onAuthStateChange((event, session) => {
                state.session = session || null;
                if (event === "PASSWORD_RECOVERY") {
                    setTimeout(renderPasswordRecovery, 0);
                    return;
                }
                setTimeout(async () => {
                    if (state.session?.user) await refreshAccess();
                    else {
                        state.access = null;
                        render();
                    }
                }, 0);
            });

            const { data, error } = await state.client.auth.getSession();
            if (error) throw error;
            state.session = data?.session || null;
            if (state.session?.user) await refreshAccess();
            else render();
            state.initialized = true;
            startCountdown();
            window.dispatchEvent(new CustomEvent("sakura:auth-ready", { detail:{ signedIn:Boolean(state.session?.user) } }));
        }
        catch (error) {
            console.warn("Sakura Account could not initialize. Core Sakura will continue normally.", error);
            state.initialized = false;
            render();
        }
        return window.SakuraAuth;
    }

    window.addEventListener("online", () => {
        if (!state.client) initialize();
        else if (state.session?.user) refreshAccess();
        else render();
    });
    window.addEventListener("offline", render);

    window.SakuraAuth = Object.freeze({
        initialize,
        openAccount,
        refreshAccess,
        signOut,
        getClient: () => state.client,
        getSession: () => state.session,
        getUser: () => state.session?.user || null,
        getAccess: () => state.access,
        hasPremiumAccess: () => Boolean(state.access?.has_premium_access),
        getEffectiveTier: () => state.access?.effective_tier || (state.session ? "free" : "signed-out")
    });

    initialize();
}());
