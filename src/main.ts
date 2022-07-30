import * as core from "@actions/core";
import * as github from "@actions/github";

const token = core.getInput("token");
const octokit = github.getOctokit(token);

async function run() {
    try {
        core.debug(JSON.stringify({ "github.context": github.context }, null, 4));

        const username = github.context.actor;
        const result = await octokit.rest.repos.getCollaboratorPermissionLevel({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            username,
        });

        const permission = result.data.permission;
        const isTrusted = ["admin", "write"].includes(permission);

        console.log(`${isTrusted ? "✅" : "⚠️"} ${username} has ${permission} permission on this repository.`);

        core.setOutput("permission", permission);
        core.setOutput("is_trusted", isTrusted);
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

run();
