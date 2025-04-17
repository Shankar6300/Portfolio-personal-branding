def fifo(frames, pages):
    frame_list = []
    page_faults = 0

    for page in pages:
        if page not in frame_list:
            if len(frame_list) < frames:
                frame_list.append(page)
            else:
                frame_list.pop(0)  # Remove the first page (FIFO)
                frame_list.append(page)
            page_faults += 1

    return page_faults
