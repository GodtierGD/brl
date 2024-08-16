import { store } from "../main.js";
import { embed } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchList } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

const roleIconMap = {
    owner: "crown",
    admin: "user-gear",
    helper: "user-shield",
    dev: "code",
    trial: "user-lock",
};

export default {
    components: { Spinner, LevelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <table class="list" v-if="list">
                    <tr v-for="([level, err], i) in list">
                        <td class="rank">
                            <p v-if="i + 1 <= 150" class="type-label-lg">#{{ i + 1 }}</p>
                            <p v-else class="type-label-lg">Legacy</p>
                        </td>
                        <td class="level" :class="{ 'active': selected == i, 'error': !level }">
                            <button @click="selected = i">
                                <span class="type-label-lg">{{ level?.name || \`Error (\${err}.json)\` }}</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="level-container">
                <div class="level" v-if="level">
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier"></LevelAuthors>
                    <div class="packs" v-if="level.packs.length > 0">
                        <div v-for="pack in level.packs" class="tag" :style="{background:pack.colour}">
                            <p>{{pack.name}}</p>
                        </div>
                    </div>
                    <iframe class="video" id="videoframe" :src="video" frameborder="0"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Points when completed</div>
                            <p>{{ score(selected + 1, 100, level.percentToQualify) }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.id }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">Password</div>
                            <p>{{ level.password || 'Free to Copy' }}</p>
                        </li>
                    </ul>
                    <h2>Records</h2>
                    <p v-if="selected + 1 <= 75"><strong>{{ level.percentToQualify }}%</strong> or better to qualify</p>
                    <p v-else-if="selected +1 <= 150"><strong>100%</strong> or better to qualify</p>
                    <p v-else>This level does not accept new records.</p>
                    <table class="records">
                        <tr v-for="record in level.records" class="record">
                            <td class="percent">
                                <p>{{ record.percent }}%</p>
                            </td>
                            <td class="user">
                                <a :href="record.link" target="_blank" class="type-label-lg">{{ record.user }}</a>
                            </td>
                            <td class="mobile">
                                <img v-if="record.mobile" :src="\`/assets/phone-landscape\${store.dark ? '-dark' : ''}.svg\`" alt="Mobile">
                            </td>
                            <td class="hz">
                                <p>{{ record.hz }}Hz</p>
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-else class="level" style="height: 100%; justify-content: center; align-items: center;">
                    <p>(ノಠ益ಠ)ノ彡┻━┻</p>
                </div>
            </div>
            <div class="meta-container">
                <div class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error" v-for="error of errors">{{ error }}</p>
                    </div>
                    <div class="og">
                        <p class="type-label-md">Website layout made by <a href="https://tsl.pages.dev/" target="_blank">TheShittyList</a></p>
                    </div>
                    <template v-if="editors">
                        <h3>List Editors</h3>
                        <ol class="editors">
                            <li v-for="editor in editors">
                                <img :src="\`/assets/\${roleIconMap[editor.role]}\${store.dark ? '-dark' : ''}.svg\`" :alt="editor.role">
                                <a v-if="editor.link" class="type-label-lg link" target="_blank" :href="editor.link">{{ editor.name }}</a>
                                <p v-else>{{ editor.name }}</p>
                            </li>
                        </ol>
                    </template>
                    <h3>Submission Requirements</h3>
                    <p>
                        Completion MUST have clicks, with should be audible throughout the whole Completion/ Verification.
                    </p>
                    <p>
                        Completion MUST have at least one death before the completion attempt. If it is on the first attempt and obviously shown that apon entering the level then it is exempt from this rule.
                    </p>
                    <p>
                        Completions or Verifications MUST be uploaded in the format of a youtube video. If it is a top 10 it must have a raw version of the completion attempt attached to the video.
                    </p>
                    <p>
                        If on mobile, you MUST show taps on screen alongside audible clicks that are consistent enough in volume. No clickbots allowed.
                    </p>
                    <p>
                        Cheat indicator is REQUIRED if a modmenu with the feature is being used, otherwise it is YOUR responsibility to mention the modmenu used within your completion or the hacks used.
                    </p>
                    <p>
                        NO Noclip Accuracy. NO Physics Bypass. CBF is allowed on the circumstance that it is mentioned in the video or description of the video of the completion or verification.
                    </p>
                    <p>
                        Please show the attempt count in the level stats menu before ending recording.
                    </p>
                    <p>
                        Once a level falls onto the Legacy List, we accept records for it for 24 hours after it falls off, then afterwards we never accept records for said level
                    </p>
                    <h3>Level Rules</h3>
                    <p>
                        JOIN THE DISCORD TO SUBMIT LEVELS TO THE LIST (VERIFICATIONS)
                    </p>
                    <p>
                        For a level to place it must be harder than the level placed at #100. We will not be accepting any levels that are easier than the top 100.
                    </p>
                    <p>
                        Level MUST be at least 31 seconds long. No shorter. If It is shorter than 31 seconds or "Medium" length it will not be accepted on the list.
                    </p>
                    <p>
                        Copying levels outside the list is NOT permitted, we wish for originality. You may however remake already existing levels BUT AGAIN do not directly copy an already existing level. Only copy other levels UNDER THE PERMISSION of it's creator(s), make sure to CREDIT them aswell.
                    </p>
                    <p>
                        Layouts will NOT be accepted onto the list. Please put some effort into the decoration. It doesn't have to be amazing or anything just fill in the blocks and make structures please.
                    </p>
                    <p>
                        Secret ways or altered routes will NOT be allowed on the list. Please complete the level in the intended route and patch every secret way.
                    </p>
                    <p>
                        If you're using an LDM/ULDM of a level it must be approved by a moderator first. Please be sure that the copy is OK by making sure with our staff.
                    </p>
                    <p>
                        CANNOT BE FULLY SPAM BASED, we do not want this to be a spam challenge. Please abide by this rule.
                    </p>
                    <p>
                        If the level has a non-newgrounds song (nong), then the youtube video MUST include a download link for the nong song.
                    </p>
                    <p>
                        No extremely chokepoint based levels like sf challenges or completely spam for extremely long periods of time.
                    </p>
                    <p>
                        The gameplay CANNOT be invisible when the PLAYER is invisible, it's either one or the other.
                    </p>
                    <p>
                        Avoid making images with over 500 objects in the geometrize mod, it causes levels to get removed off of the servers and breaks ids.
                    </p>
                    <p>
                        Levels have to be LISTED to be placed. UNLISTED levels will NOT be placed on the brl.
                    </p>
                    <p>
                        Maximum level length: 15 minutes. No auto levels.
                    </p>
                    <p>
                        STRICTLY NO RANDOM TRIGGERS.
                    </p>
                    <p>
                        No 2player levels are allowed on the list. STRICTLY NO NSFW.
                    </p>
                    <p>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        editors: [],
        loading: true,
        selected: 0,
        errors: [],
        roleIconMap,
        store
    }),
    computed: {
        level() {
            return this.list[this.selected][0];
        },
        video() {
            if (!this.level.showcase) {
                return embed(this.level.verification);
            }

            return embed(
                this.toggledShowcase
                    ? this.level.showcase
                    : this.level.verification
            );
        },
    },
    async mounted() {
        // Hide loading spinner
        this.list = await fetchList();
        this.editors = await fetchEditors();

        // Error handling
        if (!this.list) {
            this.errors = [
                "Failed to load list. Retry in a few minutes or notify list staff.",
            ];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([_, err]) => err)
                    .map(([_, err]) => {
                        return `Failed to load level. (${err}.json)`;
                    })
            );
            if (!this.editors) {
                this.errors.push("Failed to load list editors.");
            }
        }

        this.loading = false;
    },
    methods: {
        embed,
        score,
    },
};
