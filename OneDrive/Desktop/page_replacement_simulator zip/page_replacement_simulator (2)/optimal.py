def optimal(frames, pages):
    frame_list = []
    page_faults = 0

    for i, page in enumerate(pages):
        if page not in frame_list:
            if len(frame_list) < frames:
                frame_list.append(page)
            else:
                # Find the page to replace
                farthest = -1
                page_to_replace = None
                for f in frame_list:
                    try:
                        index = pages.index(f, i)
                    except ValueError:
                        index = float('inf')  # If the page is not found, it will be replaced
                    if index > farthest:
                        farthest = index
                        page_to_replace = f
                frame_list.remove(page_to_replace)
                frame_list.append(page)
            page_faults += 1

    return page_faults
