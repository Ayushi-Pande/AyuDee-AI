def generate_response(message, memories, reminders):
    text = message.lower()

    if "memory" in text or "remember" in text:
        if memories:
            memory_text = ", ".join(
                memory.title for memory in memories[:5]
            )
            return f"I remember these things: {memory_text}."
        return "I don't have any saved memories yet."

    if "reminder" in text or "medicine" in text:
        if reminders:
            reminder_text = ", ".join(
                f"{r.title} at {r.time}" for r in reminders[:5]
            )
            return f"Your reminders are: {reminder_text}."
        return "You don't have any saved reminders."

    if "hello" in text or "hi" in text:
        return "Hello! I'm your AyuDee AI companion. How are you feeling today?"

    if "thank" in text:
        return "You're welcome! I'm always here to help."

    return (
        "I'm your AyuDee AI companion. "
        "I can help you with your saved memories, reminders, "
        "activities and games."
    )