
const {ccclass, property} = cc._decorator;

@ccclass
export default class CameraController extends cc.Component {
    camera: cc.Camera;
    onLoad() {
        const camera = this.node.getComponent(cc.Camera);
        // cc.director.getPhysicsManager().attachDebugDrawToCamera(camera);
        // cc.director.getCollisionManager().attachDebugDrawToCamera(camera);
        this.camera = camera;
    }
    private target: cc.Node | null = null;
    // 设置地图(方便把视角限制在map中)
    private map = null;
    addTarget(target: cc.Node) {
        if (!this.camera) {
            return;
        }
        this.camera.addTarget(target);
    }
    setMapTarget(map: cc.Node) {
        this.map = map;
    }
    // 设置跟随节点
    setFollowTarget(tarNode: cc.Node) {
        this.target = tarNode;
    }
    lateUpdate() {
        if (!this.target) {
            return;
        }
        // 跟随target
        let targetPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let pos = this.node.parent.convertToNodeSpaceAR(targetPos);
        // 限制在map中
        if (this.map) {
            const worldPos = this.map.convertToWorldSpace(cc.Vec2.ZERO);
            const { width, height } = this.map;
            const { width: winWidth, height: winHeight } = cc.director.getWinSize();
            const zoomRatio = this.camera.zoomRatio;
            const ratioWorld = (1 - (zoomRatio - 1)) / 10;
            const minX = worldPos.x + winWidth / 2 - ratioWorld * winWidth;
            const minY = worldPos.y + winHeight / 2 - ratioWorld * winHeight;
            const maxX = width - winWidth / 2 + ratioWorld * winWidth;
            const maxY = height - winHeight / 2 + ratioWorld * winHeight;
            if (pos.x < minX) {
                pos.x = minX;
            }
            if (pos.x > maxX) {
                pos.x = maxX;
            }
            if (pos.y < minY) {
                pos.y = minY;
            }
            if (pos.y > maxY) {
                pos.y = maxY;
            }
            this.node.position = pos;
        }
    }
}
