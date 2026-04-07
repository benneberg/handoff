import type { ParadoxCard, User, Chat, ChatMessage } from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'User A' },
  { id: 'u2', name: 'User B' }
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'General' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'Hello', ts: Date.now() },
];
export const MOCK_PARADOX_DECK: ParadoxCard[] = [
  {
    id: 'p1',
    title: 'Graceful Degradation',
    systemConcept: 'The ability of a system to maintain limited functionality even when portions of it fail, rather than crashing entirely.',
    humanContext: 'In times of grief or exhaustion, we do not need to be our "full selves." Success is simply keeping the core systems running while the rest repairs.',
    quote: "The tree that bends in the storm does not break."
  },
  {
    id: 'p2',
    title: 'Eventual Consistency',
    systemConcept: 'A consistency model where data will eventually be the same across all nodes, given enough time without new updates.',
    humanContext: 'Our actions and our values rarely align in the present moment. Growth is the patient process of allowing our character to catch up with our intentions.',
    quote: "Identity is not a snapshot; it is a convergence."
  },
  {
    id: 'p3',
    title: 'Load Balancing',
    systemConcept: 'Distributing network traffic across multiple servers to ensure no single resource is overwhelmed.',
    humanContext: 'We often try to process all of life\'s demands through a single "emotional server." True resilience is learning to distribute our burdens across community, rest, and routine.',
    quote: "You were never meant to be a single point of failure."
  },
  {
    id: 'p4',
    title: 'Deadlock',
    systemConcept: 'A state where two or more processes are unable to proceed because each is waiting for the other to release a resource.',
    humanContext: 'Forgiveness is the only way to break the deadlock of a broken relationship where both parties wait for the other to apologize first.',
    quote: "To move forward, one must release the resource they never owned: the past."
  },
  {
    id: 'p5',
    title: 'Garbage Collection',
    systemConcept: 'Automatic memory management that reclaims memory occupied by objects that are no longer in use by the program.',
    humanContext: 'We carry ghosts of old versions of ourselves. Mental health is the quiet, background process of identifying what no longer serves us and letting it go.',
    quote: "The art of living is the art of forgetting what is no longer true."
  }
];