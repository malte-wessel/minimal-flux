/**
 * This file is provided by Facebook for testing and evaluation purposes
 * only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

module.exports = {

    convertRawMessage: function(rawMessage, currentThreadId) {
        return {
            id: rawMessage.id,
            threadId: rawMessage.threadId,
            authorName: rawMessage.authorName,
            date: new Date(rawMessage.timestamp),
            text: rawMessage.text,
            isRead: rawMessage.threadId === currentThreadId
        };
    },

    getCreatedMessageData: function(text, currentThreadId) {
        var timestamp = Date.now();
        return {
            id: 'm_' + timestamp,
            threadId: currentThreadId,
            authorName: 'Bill', // hard coded for the example
            date: new Date(timestamp),
            text: text,
            isRead: true
        };
    }

};