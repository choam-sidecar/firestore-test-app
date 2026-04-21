import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { UserProfile, createUserSchema, updateUserSchema } from "../models/user";

const db = getFirestore();
const usersCollection = db.collection("users");

export async function createUser(
  uid: string,
  data: unknown
): Promise<UserProfile> {
  const validated = createUserSchema.parse(data);

  const user: UserProfile = {
    uid,
    email: validated.email,
    displayName: validated.displayName,
    photoUrl: null,
    phone: validated.phone,
    address: validated.address,
    role: "customer",
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await usersCollection.doc(uid).set(user);
  return user;
}

export async function getUser(uid: string): Promise<UserProfile | null> {
  const doc = await usersCollection.doc(uid).get();
  if (!doc.exists) return null;
  return doc.data() as UserProfile;
}

export async function updateUser(
  uid: string,
  data: unknown
): Promise<void> {
  const validated = updateUserSchema.parse(data);

  await usersCollection.doc(uid).update({
    ...validated,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function deactivateUser(uid: string): Promise<void> {
  await usersCollection.doc(uid).update({
    isActive: false,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function listActiveUsers(
  limit: number = 50,
  startAfter?: string
): Promise<UserProfile[]> {
  let query = usersCollection
    .where("isActive", "==", true)
    .orderBy("createdAt", "desc")
    .limit(limit);

  if (startAfter) {
    const startDoc = await usersCollection.doc(startAfter).get();
    query = query.startAfter(startDoc);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => doc.data() as UserProfile);
}
