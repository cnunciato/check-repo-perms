import * as core from "@actions/core";
import * as github from "@actions/github";

const token = core.getInput("token");
const octokit = github.getOctokit(token);

async function run() {
    try {

        // Log the full context in debug mode.
        core.debug(JSON.stringify({ "github.context": github.context }, null, 4));

        const username = github.context.actor;
        const orgName = github.context.repo.owner;
        const repoName = github.context.repo.repo;

        const permsResult = await octokit.rest.repos.getCollaboratorPermissionLevel({
            owner: orgName,
            repo: repoName,
            username,
        });

        const permission = permsResult.data.permission;

        const hasWrite = ["admin", "write"].includes(permission);
        const isAdmin = permission === "admin";

        core.info(`${username} has '${permission}' permission on this repository.`);

        core.setOutput("permission", permission);
        core.setOutput("has_write", hasWrite);
        core.setOutput("is_admin", isAdmin);
    } catch (error) {
        core.error(JSON.stringify({ error }, null, 4));

        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

run();
