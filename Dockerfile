FROM quay.io/pypa/manylinux_2_34_x86_64
WORKDIR /io
RUN yum install -y \
    clang \
    python3-devel \
    patchelf \
    file \
    cmake \
    ninja-build \
    unzip \
    zip
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
RUN rm -rf /opt/python/*
RUN echo '#!/bin/bash' > /build_wheels.sh && \
    echo 'set -ex  # Exit on error, print commands' >> /build_wheels.sh && \
    echo 'PYTHON_VERSIONS=("3.9")' >> /build_wheels.sh && \
    # echo 'PYTHON_VERSIONS=("3.9" "3.10" "3.11" "3.12" "3.13")' >> /build_wheels.sh && \
    echo 'rm -rf dist' >> /build_wheels.sh && \
    echo 'mkdir -p wheelhouse' >> /build_wheels.sh && \
    echo 'for PY_VERSION in "${PYTHON_VERSIONS[@]}"; do' >> /build_wheels.sh && \
    echo '    echo "Building for Python ${PY_VERSION}"' >> /build_wheels.sh && \
    echo '    # Install build dependencies' >> /build_wheels.sh && \
    echo '    uv pip install auditwheel scikit-build-core cmake ninja --system' >> /build_wheels.sh && \
    echo '    # Build the wheel' >> /build_wheels.sh && \
    echo '    uv build --no-sources --python "${PY_VERSION}"' >> /build_wheels.sh && \
    echo '    # Debug wheel contents' >> /build_wheels.sh && \
    echo '    WHEEL_FILE=$(ls dist/*.whl)' >> /build_wheels.sh && \
    echo '    echo "Full wheel contents (including file sizes):"' >> /build_wheels.sh && \
    echo '    unzip -l "$WHEEL_FILE" | sort -k3' >> /build_wheels.sh && \
    echo '    # Repair the wheel' >> /build_wheels.sh && \
    echo '    auditwheel -v repair --plat manylinux_2_34_x86_64 -w wheelhouse dist/*.whl' >> /build_wheels.sh && \
    echo 'done' >> /build_wheels.sh
RUN chmod +x /build_wheels.sh
ENTRYPOINT ["/build_wheels.sh"]