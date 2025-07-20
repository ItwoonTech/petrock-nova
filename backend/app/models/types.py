from typing import Annotated

from pydantic import StringConstraints

ContentfulString = Annotated[str, StringConstraints(min_length=1, strip_whitespace=True)]
