import { fetchLeaderboard } from '../content.js';
import { localize } from '../util.js';

import Spinner from '../components/Spinner.js';

export default {
    components: {
        Spinner,
    },
    data: () => ({
        leaderboard: [],
        loading: true,
        selected: 0,
        err: [],
    }),
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-leaderboard-container">
            <div class="page-leaderboard">
                <div class="error-container">
                    <p class="error" v-if="err.length > 0">
                        Leaderboard may be incorrect, as the following levels could not be loaded: {{ err.join(', ') }}
                    </p>
                </div>
                <div class="board-container">
                    <table class="board">
                        <tr v-for="(ientry, i) in leaderboard">
                            <td class="rank">
                                <p class="type-label-lg">#{{ i + 1 }}</p>
                            </td>
                            <td class="total">
                                <p class="type-label-lg">{{ localize(ientry.total) }}</p>
                            </td>
                            <td class="user" :class="{ 'active': selected == i }">
                                <button @click="selected = i">
                                    <span class="type-label-lg">{{ ientry.user }}</span>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="player-container">
                    <div class="player">
                        <h1>#{{ selected + 1 }} {{ entry.user }}</h1>
                        <h3>{{ entry.total }}</h3>
                        <h2 v-if="entry.verified.length > 0">Verified ({{ entry.verified.length}})</h2>
                        <table class="table">
                            <tr v-for="score in entry.verified">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                        <h2 v-if="entry.completed.length > 0">Completed ({{ entry.completed.length }})</h2>
                        <table class="table">
                            <tr v-for="score in entry.completed">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                        <h2 v-if="entry.progressed.length > 0">Progressed ({{entry.progressed.length}})</h2>
                        <table class="table">
                            <tr v-for="score in entry.progressed">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.percent }}% {{ score.level }}</a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    `,
    computed: {
        entry() {
            return this.leaderboard[this.selected];
        },
    },
    async mounted() {
        const [leaderboard, err] = await fetchLeaderboard();
        this.leaderboard = leaderboard;
        this.err = err;
        // Hide loading spinner
        this.loading = false;
    },
    methods: {
        localize,
        applyRankEffects() {
            // Wait until the DOM has fully rendered to apply the effect
            this.$nextTick(() => {
                // Gold (1st place)
                const firstPlaceRank = document.querySelector('#rank-0');
                const firstPlaceUsername = document.querySelector('#user-0');
                const firstPlaceTotal = document.querySelector('#total-0');
                
                if (firstPlaceRank && firstPlaceUsername && firstPlaceTotal) {
                    this.addGlowEffect(firstPlaceRank, '#FFD700', 'breathingGold');
                    this.addGlowEffect(firstPlaceUsername, '#FFD700', 'breathingGold');
                    this.addGlowEffect(firstPlaceTotal, '#FFD700', 'breathingGold');
                }

                // Silver (2nd place)
                const secondPlaceRank = document.querySelector('#rank-1');
                const secondPlaceUsername = document.querySelector('#user-1');
                const secondPlaceTotal = document.querySelector('#total-1');
                
                if (secondPlaceRank && secondPlaceUsername && secondPlaceTotal) {
                    this.addGlowEffect(secondPlaceRank, '#C0C0C0', 'breathingSilver');
                    this.addGlowEffect(secondPlaceUsername, '#C0C0C0', 'breathingSilver');
                    this.addGlowEffect(secondPlaceTotal, '#C0C0C0', 'breathingSilver');
                }

                // Bronze (3rd place)
                const thirdPlaceRank = document.querySelector('#rank-2');
                const thirdPlaceUsername = document.querySelector('#user-2');
                const thirdPlaceTotal = document.querySelector('#total-2');
                
                if (thirdPlaceRank && thirdPlaceUsername && thirdPlaceTotal) {
                    this.addGlowEffect(thirdPlaceRank, '#CD7F32', 'breathingBronze');
                    this.addGlowEffect(thirdPlaceUsername, '#CD7F32', 'breathingBronze');
                    this.addGlowEffect(thirdPlaceTotal, '#CD7F32', 'breathingBronze');
                }
            });
        },
        addGlowEffect(element, color, animationName) {
            // Apply color and glow effect to text itself
            element.style.transition = "all 0.5s ease-in-out";
            element.style.fontWeight = 'bold';
            element.style.color = color; // Set the color (Gold, Silver, or Bronze)
            element.style.animation = `${animationName} 3s infinite alternate`; // Apply faster animation (3s duration)
        }
    },
};

// Add the breathing glow animations for Gold, Silver, and Bronze
const style = document.createElement('style');
style.innerHTML = `
    @keyframes breathingGold {
        0% {
            text-shadow: 0 0 5px rgba(255, 215, 0, 0.65), 0 0 10px rgba(255, 215, 0, 0.65), 0 0 15px rgba(255, 215, 0, 0.65), 0 0 20px rgba(255, 215, 0, 0.65);
        }
        100% {
            text-shadow: 0 0 20px rgba(255, 215, 0, 0.25), 0 0 30px rgba(255, 215, 0, 0.25), 0 0 40px rgba(255, 215, 0, 0.25), 0 0 50px rgba(255, 215, 0, 0.25);
        }
    }
    @keyframes breathingSilver {
        0% {
            text-shadow: 0 0 5px rgba(192, 192, 192, 0.65), 0 0 10px rgba(192, 192, 192, 0.65), 0 0 15px rgba(192, 192, 192, 0.65), 0 0 20px rgba(192, 192, 192, 0.65);
        }
        100% {
            text-shadow: 0 0 20px rgba(192, 192, 192, 0.25), 0 0 30px rgba(192, 192, 192, 0.25), 0 0 40px rgba(192, 192, 192, 0.25), 0 0 50px rgba(192, 192, 192, 0.25);
        }
    }
    @keyframes breathingBronze {
        0% {
            text-shadow: 0 0 5px rgba(205, 127, 50, 0.65), 0 0 10px rgba(205, 127, 50, 0.65), 0 0 15px rgba(205, 127, 50, 0.65), 0 0 20px rgba(205, 127, 50, 0.65);
        }
        100% {
            text-shadow: 0 0 20px rgba(205, 127, 50, 0.25), 0 0 30px rgba(205, 127, 50, 0.25), 0 0 40px rgba(205, 127, 50, 0.25), 0 0 50px rgba(205, 127, 50, 0.25);
        }
    }
`;
document.head.appendChild(style);