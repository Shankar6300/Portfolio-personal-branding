def lru(frames, pages):
    frame_list = []
    page_faults = 0
    page_map = {}

    for i, page in enumerate(pages):
        if page not in frame_list:
            if len(frame_list) < frames:
                frame_list.append(page)
            else:
                lru_page = min(page_map, key=page_map.get)  # Find the least recently used page
                frame_list.remove(lru_page)
                frame_list.append(page)
                del page_map[lru_page]
            page_faults += 1
        page_map[page] = i  # Update the last used index

    return page_faults
