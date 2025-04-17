def fifo(frames, pages):
    queue = []
    faults = 0
    for page in pages:
        if page not in queue:
            if len(queue) >= frames:
                queue.pop(0)
            queue.append(page)
            faults += 1
    return faults

def lru(frames, pages):
    memory = []
    faults = 0
    for page in pages:
        if page in memory:
            memory.remove(page)
            memory.append(page)
        else:
            if len(memory) >= frames:
                memory.pop(0)
            memory.append(page)
            faults += 1
    return faults

def optimal(frames, pages):
    memory = []
    faults = 0
    for i in range(len(pages)):
        if pages[i] not in memory:
            if len(memory) < frames:
                memory.append(pages[i])
            else:
                future = pages[i+1:]
                indices = [(future.index(p) if p in future else float('inf')) for p in memory]
                memory.pop(indices.index(max(indices)))
                memory.append(pages[i])
            faults += 1
    return faults
